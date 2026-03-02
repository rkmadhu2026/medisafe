import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import session from "express-session";
import SQLiteStoreFactory from "connect-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("medisafe.db");
const SQLiteStore = SQLiteStoreFactory(session);

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS scans (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    patient_name TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    raw_text TEXT,
    structured_data TEXT,
    risk_score INTEGER,
    status TEXT,
    language TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  
  CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    scan_id TEXT,
    severity TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved INTEGER DEFAULT 0,
    FOREIGN KEY(scan_id) REFERENCES scans(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Session configuration
  app.use(session({
    store: new SQLiteStore({ db: 'sessions.db', dir: '.' }) as any,
    secret: process.env.SESSION_SECRET || 'medisafe-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
  }));

  // Auth Middleware
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.session.userId) {
      return next();
    }
    res.status(401).json({ error: "Unauthorized" });
  };

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, name } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = Math.random().toString(36).substr(2, 9);
      const stmt = db.prepare("INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)");
      stmt.run(id, email, hashedPassword, name);
      
      req.session.userId = id;
      res.json({ success: true, user: { id, email, name } });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req: any, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });
    const user: any = db.prepare("SELECT id, email, name FROM users WHERE id = ?").get(req.session.userId);
    res.json({ user });
  });

  // API Routes (Protected)
  app.get("/api/scans", isAuthenticated, (req: any, res) => {
    const scans = db.prepare("SELECT * FROM scans WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50").all(req.session.userId);
    res.json(scans.map((s: any) => ({
      ...s,
      structured_data: JSON.parse(s.structured_data as string)
    })));
  });

  app.post("/api/scans", isAuthenticated, (req: any, res) => {
    const { id, patient_name, raw_text, structured_data, risk_score, status, language } = req.body;
    const stmt = db.prepare(`
      INSERT INTO scans (id, user_id, patient_name, raw_text, structured_data, risk_score, status, language)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, req.session.userId, patient_name, raw_text, JSON.stringify(structured_data), risk_score, status, language);
    res.json({ success: true });
  });

  app.get("/api/alerts", isAuthenticated, (req: any, res) => {
    const alerts = db.prepare(`
      SELECT alerts.* FROM alerts 
      JOIN scans ON alerts.scan_id = scans.id 
      WHERE scans.user_id = ? 
      ORDER BY alerts.timestamp DESC
    `).all(req.session.userId);
    res.json(alerts);
  });

  app.post("/api/alerts", isAuthenticated, (req, res) => {
    const { id, scan_id, severity, message } = req.body;
    const stmt = db.prepare(`
      INSERT INTO alerts (id, scan_id, severity, message)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(id, scan_id, severity, message);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
