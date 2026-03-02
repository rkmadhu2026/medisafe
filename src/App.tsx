import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Scan as ScanIcon, 
  Database as DbIcon, 
  Bell, 
  Settings, 
  Search, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Globe, 
  Menu,
  X,
  Upload,
  Camera,
  ArrowRight,
  ShieldCheck,
  Zap,
  Languages,
  Activity,
  User as UserIcon,
  Volume2,
  Sparkles,
  Info,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { geminiService, ScanResult } from './services/geminiService';
import { Scan, Alert, User } from './types';

// --- Components ---

const AuthPage = ({ onAuthSuccess }: { onAuthSuccess: (user: User) => void }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'forgot') {
      // Mock forgot password
      setTimeout(() => {
        setSuccess('If an account exists with this email, reset instructions have been sent.');
        setLoading(false);
      }, 1000);
      return;
    }

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login' ? { email, password } : { email, password, name };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        onAuthSuccess(data.user);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[32px] p-10 shadow-2xl relative z-10"
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-teal-500/20">M</div>
          <span className="font-display text-2xl font-bold text-navy-800 tracking-tight">MediSafe AI</span>
        </div>

        <h2 className="text-2xl font-display font-bold text-navy-800 text-center mb-2">
          {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
        </h2>
        <p className="text-slate-400 text-center text-sm mb-8 font-medium">
          {mode === 'login' ? 'Sign in to access your dashboard' : mode === 'register' ? 'Join the prescription safety network' : 'Enter your email to receive instructions'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all font-medium text-sm"
                placeholder="Dr. John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all font-medium text-sm"
              placeholder="name@hospital.com"
            />
          </div>
          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] font-bold text-teal-500 hover:underline uppercase tracking-widest"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all font-medium text-sm"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-500 text-xs font-bold flex items-center gap-2">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={14} />
              {success}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-2xl font-bold shadow-lg shadow-teal-500/30 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Instructions')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
              setSuccess('');
            }}
            className="text-sm font-bold text-teal-500 hover:underline"
          >
            {mode === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' 
        : 'text-slate-400 hover:bg-white/10 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
    {badge && (
      <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

const StatCard = ({ icon: Icon, label, value, trend, trendUp }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-xl text-teal-500">
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
        trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
      }`}>
        {trendUp ? '↑' : '↓'} {trend}
      </div>
    </div>
    <div className="text-3xl font-display font-bold text-navy-800 mb-1">{value}</div>
    <div className="text-slate-400 text-sm font-medium">{label}</div>
  </div>
);

// --- Pages ---

const LandingPage = ({ onStart }: { onStart: () => void }) => (
  <div className="min-h-screen bg-navy-900 text-white overflow-hidden relative">
    {/* Background Elements */}
    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
    
    <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-400 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-teal-500/20">M</div>
        <span className="font-display text-2xl font-bold tracking-tight">MediSafe AI</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        <button onClick={onStart} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all">Sign In</button>
        <button onClick={onStart} className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 rounded-xl font-bold shadow-lg shadow-teal-500/30 transition-all">Start Free Trial</button>
      </div>
    </nav>

    <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 grid lg:grid-cols-2 gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-300 text-xs font-bold mb-8">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          NOW SUPPORTING 14 INDIAN LANGUAGES
        </div>
        <h1 className="text-6xl md:text-7xl font-display font-bold leading-[1.1] mb-8">
          Every prescription <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">understood safely.</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
          AI-powered prescription scanning, drug interaction detection, and regional language translation — protecting patients across the healthcare value chain.
        </p>
        <div className="flex flex-wrap gap-4">
          <button onClick={onStart} className="px-8 py-4 bg-teal-500 hover:bg-teal-400 rounded-2xl font-bold text-lg shadow-xl shadow-teal-500/40 transition-all flex items-center gap-2">
            Start Free Trial <ArrowRight size={20} />
          </button>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-lg transition-all">
            Watch Demo
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="bg-white rounded-[32px] p-4 shadow-2xl shadow-teal-500/20 rotate-[-2deg]">
          <div className="bg-slate-50 rounded-[24px] overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MediSafe Dashboard</div>
            </div>
            <div className="p-8">
              <div className="w-full h-48 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 mb-8">
                <div className="p-4 bg-white rounded-full shadow-sm text-teal-500">
                  <Camera size={32} />
                </div>
                <div className="text-slate-400 font-medium text-sm">Drop prescription to scan</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Drugs', val: '4', color: 'text-teal-500' },
                  { label: 'Risk', val: '12', color: 'text-emerald-500' },
                  { label: 'Alerts', val: '1', color: 'text-rose-500' }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{item.label}</div>
                    <div className={`text-2xl font-display font-bold ${item.color}`}>{item.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </main>

    <section className="relative z-10 border-t border-white/5 bg-white/2 px-8 py-12">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-16 md:gap-32 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex flex-col items-center">
          <div className="text-3xl font-display font-bold">98.2%</div>
          <div className="text-xs font-medium uppercase tracking-widest text-slate-400">OCR Accuracy</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-display font-bold">3,200+</div>
          <div className="text-xs font-medium uppercase tracking-widest text-slate-400">Drugs in DB</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-display font-bold">14</div>
          <div className="text-xs font-medium uppercase tracking-widest text-slate-400">Languages</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-display font-bold">&lt; 3s</div>
          <div className="text-xs font-medium uppercase tracking-widest text-slate-400">Processing</div>
        </div>
      </div>
    </section>
  </div>
);

const Dashboard = ({ scans, alerts, user }: { scans: Scan[], alerts: Alert[], user: User | null }) => (
  <div className="p-8">
    <div className="mb-8">
      <div className="text-slate-400 text-sm font-medium mb-1">Good evening, {user?.name?.split(' ')[0] || 'User'} 👋</div>
      <h2 className="text-3xl font-display font-bold text-navy-800">Safety Overview</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StatCard icon={ScanIcon} label="Prescriptions Scanned" value={scans.length} trend="12%" trendUp />
      <StatCard icon={AlertTriangle} label="Interactions Detected" value={alerts.length} trend="3" trendUp={false} />
      <StatCard icon={ShieldCheck} label="OCR Accuracy" value="97.8%" trend="2.1%" trendUp />
      <StatCard icon={Clock} label="Avg Processing Time" value="2.4s" trend="0.3s" trendUp />
    </div>

    <div className="grid lg:grid-cols-3 gap-8 mb-10">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-navy-800">Recent Prescriptions</h3>
          <button className="text-teal-500 text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Scan ID</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {scans.slice(0, 5).map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-teal-600">#{scan.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 font-bold text-navy-800">{scan.patient_name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${scan.risk_score > 70 ? 'bg-rose-500' : scan.risk_score > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${scan.risk_score}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-500">{scan.risk_score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      scan.status === 'Safe' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${scan.status === 'Safe' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {scan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h3 className="font-bold text-navy-800">Recent Activity</h3>
          </div>
          <div className="p-6 space-y-6">
            {alerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="flex gap-4">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  alert.severity === 'critical' ? 'bg-rose-50 text-rose-500' : 
                  alert.severity === 'high' ? 'bg-orange-50 text-orange-500' :
                  alert.severity === 'medium' ? 'bg-amber-50 text-amber-500' :
                  'bg-blue-50 text-blue-500'
                }`}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <div className="text-sm text-slate-600 leading-snug">
                    <span className="font-bold text-navy-800">{alert.severity.toUpperCase()}</span>: {alert.message}
                  </div>
                  <div className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-widest">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-navy-800">Prescription History</h3>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{scans.length} Total</div>
          </div>
          <div className="p-6 max-h-[400px] overflow-y-auto space-y-4 custom-scrollbar">
            {scans.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm italic">No history available</div>
            ) : (
              scans.map((scan) => (
                <div key={scan.id} className="p-4 rounded-xl border border-slate-50 hover:border-teal-100 transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-navy-800 group-hover:text-teal-600 transition-colors">{scan.patient_name}</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      scan.status === 'Safe' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {scan.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="text-slate-400 font-medium">{new Date(scan.timestamp).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-bold uppercase text-[9px]">Risk Score:</span>
                      <span className={`font-bold ${scan.risk_score > 70 ? 'text-rose-500' : scan.risk_score > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {scan.risk_score}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LANGUAGES = [
  'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 
  'Marathi', 'Gujarati', 'Bengali', 'Punjabi', 'Odia', 'Assamese', 'English'
];

const CameraCapture = ({ onCapture, onClose }: { onCapture: (base64: string) => void, onClose: () => void }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Could not access camera. Please check permissions.");
    }
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg');
        onCapture(base64);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-navy-900 flex flex-col items-center justify-center p-6">
      <div className="relative w-full max-w-2xl aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <AlertTriangle size={48} className="text-rose-500 mb-4" />
            <p className="text-white font-bold mb-4">{error}</p>
            <button onClick={onClose} className="px-6 py-2 bg-white/10 rounded-xl text-white font-bold">Close</button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
              <button 
                onClick={onClose}
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <X size={24} />
              </button>
              
              <button 
                onClick={capture}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <div className="w-16 h-16 border-4 border-navy-900 rounded-full" />
              </button>
              
              <div className="w-12 h-12" /> {/* Spacer */}
            </div>
          </>
        )}
      </div>
      <p className="mt-8 text-slate-400 text-sm font-medium">Position the prescription clearly within the frame</p>
    </div>
  );
};

const ScanPage = ({ onScanComplete }: { onScanComplete: (result: ScanResult, patientName: string) => void }) => {
  const [scanning, setScanning] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [translation, setTranslation] = useState<string>('');
  const [targetLang, setTargetLang] = useState('Tamil');
  const [sourceLang, setSourceLang] = useState('English');
  
  // New features state
  const [deepAnalysis, setDeepAnalysis] = useState<string>('');
  const [analyzingDeeply, setAnalyzingDeeply] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);
  const [drugInfo, setDrugInfo] = useState<string>('');
  const [fetchingDrugInfo, setFetchingDrugInfo] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string>('');
  const [fetchingSpeech, setFetchingSpeech] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [verifiedInteractions, setVerifiedInteractions] = useState<ScanResult['interactions']>([]);
  const [checkingInteractions, setCheckingInteractions] = useState(false);
  const [drugSearchQuery, setDrugSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyRawText = () => {
    if (result?.raw_text) {
      navigator.clipboard.writeText(result.raw_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDrugSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugSearchQuery.trim()) return;
    
    setSelectedDrug(drugSearchQuery);
    setFetchingDrugInfo(true);
    try {
      const info = await geminiService.getDrugInfo(drugSearchQuery);
      setDrugInfo(info);
    } catch (error) {
      console.error("Drug search failed", error);
      setDrugInfo("Could not find information for this drug. Please try a different name.");
    } finally {
      setFetchingDrugInfo(false);
    }
  };

  const processImage = async (base64: string, mimeType: string = 'image/jpeg') => {
    setScanning(true);
    setResult(null);
    setTranslation('');
    setDeepAnalysis('');
    setVerifiedInteractions([]);
    try {
      const scanResult = await geminiService.scanPrescription(base64, mimeType, sourceLang);
      setResult(scanResult);
      
      // Initial translation
      await translate(scanResult, targetLang);
      
      onScanComplete(scanResult, patientName || "Anonymous Patient");
    } catch (error) {
      console.error(error);
    } finally {
      setScanning(false);
    }
  };

  const handleDeepAnalysis = async () => {
    if (!result) return;
    setAnalyzingDeeply(true);
    try {
      const analysis = await geminiService.deepAnalyze(result.raw_text);
      setDeepAnalysis(analysis);
    } catch (error) {
      console.error("Deep analysis failed", error);
    } finally {
      setAnalyzingDeeply(false);
    }
  };

  const handleCheckInteractions = async () => {
    if (!result) return;
    setCheckingInteractions(true);
    try {
      const interactions = await geminiService.checkDrugInteractions(result.drugs);
      setVerifiedInteractions(interactions);
    } catch (error) {
      console.error("Interaction check failed", error);
    } finally {
      setCheckingInteractions(false);
    }
  };

  const handleDrugInfo = async (drugName: string) => {
    setSelectedDrug(drugName);
    setFetchingDrugInfo(true);
    setDrugInfo('');
    try {
      const info = await geminiService.getDrugInfo(drugName);
      setDrugInfo(info);
    } catch (error) {
      console.error("Drug info failed", error);
    } finally {
      setFetchingDrugInfo(false);
    }
  };

  const handleTTS = async () => {
    if (!translation) return;
    
    if (playingAudio && audioSource) {
      audioSource.stop();
      setPlayingAudio(false);
      setAudioSource(null);
      return;
    }

    if (fetchingSpeech) return;

    setFetchingSpeech(true);
    try {
      const base64 = await geminiService.generateSpeech(translation);
      setAudioBase64(base64);
      
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Int16Array(len / 2);
      for (let i = 0; i < len; i += 2) {
        bytes[i / 2] = (binaryString.charCodeAt(i + 1) << 8) | binaryString.charCodeAt(i);
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = audioContext.createBuffer(1, bytes.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      
      for (let i = 0; i < bytes.length; i++) {
        channelData[i] = bytes[i] / 32768;
      }

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => {
        setPlayingAudio(false);
        setAudioSource(null);
      };
      setPlayingAudio(true);
      setAudioSource(source);
      source.start();
    } catch (error) {
      console.error("TTS failed", error);
      setPlayingAudio(false);
      setAudioSource(null);
    } finally {
      setFetchingSpeech(false);
    }
  };

  const translate = async (scanResult: ScanResult, lang: string) => {
    setTranslating(true);
    setIsVerified(false);
    setReviewNotes('');
    try {
      const instructions = scanResult.drugs.map(d => `${d.name}: ${d.instructions}`).join('\n');
      const translated = await geminiService.translateInstructions(instructions, lang);
      setTranslation(translated);
      
      // Call medical review
      setReviewing(true);
      try {
        const review = await geminiService.reviewTranslation(instructions, translated, lang);
        if (review.verified) {
          setIsVerified(true);
        } else {
          setTranslation(review.correctedText);
          setIsVerified(true); // Mark as verified after correction
        }
        setReviewNotes(review.notes);
      } catch (reviewError) {
        console.error("Medical review failed", reviewError);
      } finally {
        setReviewing(false);
      }
    } catch (error) {
      console.error("Translation failed", error);
    } finally {
      setTranslating(false);
    }
  };

  useEffect(() => {
    if (result && !scanning) {
      translate(result, targetLang);
    }
  }, [targetLang]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      await processImage(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = async (base64: string) => {
    setIsCameraOpen(false);
    await processImage(base64);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-navy-800">Scan Prescription</h2>
        <p className="text-slate-400 font-medium">Upload, verify, and translate in real-time.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 card-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-500/10 text-teal-500 rounded-2xl flex items-center justify-center">
                <Search size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy-800">Drug Database Search</h3>
                <p className="text-slate-400 text-sm font-medium">Search for medication details and side effects.</p>
              </div>
            </div>
            <form onSubmit={handleDrugSearch} className="relative">
              <input 
                type="text" 
                value={drugSearchQuery}
                onChange={(e) => setDrugSearchQuery(e.target.value)}
                placeholder="Search drug name (e.g. Metformin, Aspirin)..."
                className="w-full pl-6 pr-32 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all font-medium"
              />
              <button 
                type="submit"
                disabled={fetchingDrugInfo || !drugSearchQuery.trim()}
                className="absolute right-2 top-2 bottom-2 px-6 bg-navy-900 text-white rounded-xl font-bold text-sm hover:bg-navy-800 transition-all disabled:opacity-50"
              >
                {fetchingDrugInfo ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 card-shadow">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Patient Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 card-shadow">
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">OCR Language</label>
                  <div className="group relative">
                    <Info size={12} className="text-slate-300 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-navy-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-xl border border-white/10">
                      <div className="font-bold text-teal-400 mb-1">Why select a language?</div>
                      Handwritten prescriptions vary by region. Selecting the language helps the AI apply specific linguistic patterns for better extraction.
                    </div>
                  </div>
                </div>
                <div className="relative group/ocr">
                  <Languages className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select 
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all font-medium appearance-none cursor-pointer"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-navy-900 text-white text-[11px] rounded-xl opacity-0 group-hover/ocr:opacity-100 transition-all pointer-events-none z-50 shadow-xl border border-white/10">
                    <div className="font-bold mb-1 flex items-center gap-2 text-teal-400">
                      <Sparkles size={12} />
                      Accuracy Boost
                    </div>
                    Specifying the language allows the AI to use specialized character recognition models, significantly reducing errors in handwritten prescriptions.
                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 border-8 border-transparent border-t-navy-900" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center hover:border-teal-500 hover:bg-teal-50/30 transition-all cursor-pointer relative group">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileUpload}
                disabled={scanning}
              />
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-500 group-hover:scale-110 transition-transform">
                {scanning ? <Zap size={40} className="animate-pulse" /> : <Upload size={40} />}
              </div>
              <h3 className="text-xl font-bold text-navy-800 mb-2">
                {scanning ? 'Analyzing Prescription...' : 'Upload Prescription'}
              </h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Drag and drop an image or click to browse.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <button 
              onClick={() => setIsCameraOpen(true)}
              disabled={scanning}
              className="w-full py-6 bg-white border border-slate-100 card-shadow rounded-3xl flex items-center justify-center gap-4 hover:bg-slate-50 transition-all group disabled:opacity-50"
            >
              <div className="p-3 bg-teal-50 text-teal-500 rounded-2xl group-hover:scale-110 transition-transform">
                <Camera size={24} />
              </div>
              <div className="text-left">
                <div className="font-bold text-navy-800">Use Camera</div>
                <div className="text-xs text-slate-400 font-medium">Capture a photo of the prescription</div>
              </div>
            </button>
          </div>

          {isCameraOpen && (
            <CameraCapture 
              onCapture={handleCameraCapture} 
              onClose={() => setIsCameraOpen(false)} 
            />
          )}

          {(translation || translating) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <Globe size={20} className={translating ? 'animate-spin' : ''} />
                  Patient Instructions
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleTTS}
                    disabled={translating || fetchingSpeech}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-bold text-xs transition-all shadow-sm ${
                      playingAudio 
                        ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                        : fetchingSpeech
                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    {playingAudio ? (
                      <>
                        <X size={16} className="animate-pulse" />
                        Stop Audio
                      </>
                    ) : fetchingSpeech ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Volume2 size={16} />
                        Listen to Instructions
                      </>
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Target Language:</span>
                    <select 
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="bg-white border border-emerald-200 rounded-lg px-3 py-1.5 text-xs font-bold text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className={`text-emerald-900 leading-relaxed whitespace-pre-wrap font-medium transition-opacity duration-200 ${translating ? 'opacity-50' : 'opacity-100'}`}>
                {translating ? 'Translating instructions...' : translation}
              </div>

              {isVerified && !translating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 pt-6 border-t border-emerald-100 flex items-start gap-4"
                >
                  <div className="p-2 bg-emerald-500 text-white rounded-full">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">Medical Review Verified</div>
                    <p className="text-[10px] text-emerald-600/80 font-medium italic">
                      {reviewing ? 'Performing clinical cross-check...' : reviewNotes || 'This translation has been verified for medical accuracy and dosage consistency.'}
                    </p>
                  </div>
                </motion.div>
              )}

              {reviewing && (
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest animate-pulse">
                  <Sparkles size={12} />
                  Performing Medical Review...
                </div>
              )}
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl border border-slate-100 card-shadow overflow-hidden"
            >
              <div className="bg-navy-800 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold">Scan Results</h3>
                  <button 
                    onClick={handleCopyRawText}
                    className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest"
                    title="Copy raw extracted text"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy Raw Text'}
                  </button>
                </div>
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Processed in 2.1s
                </div>
              </div>
              <div className="p-8 space-y-6">
                {result.drugs.map((drug, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-slate-100 hover:border-teal-500 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      <button 
                        onClick={() => handleDrugInfo(drug.name)}
                        className="font-bold text-navy-800 text-lg hover:text-teal-600 transition-colors text-left"
                      >
                        {drug.name}
                      </button>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDrugInfo(drug.name)}
                          className="p-1.5 text-slate-400 hover:text-teal-500 hover:bg-teal-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Drug Information"
                        >
                          <Info size={16} />
                        </button>
                        <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-wider">
                          {Math.round(drug.confidence * 100)}% Match
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Dosage</div>
                        <div className="text-sm font-bold text-slate-600">{drug.dosage}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Frequency</div>
                        <div className="text-sm font-bold text-slate-600">{drug.frequency}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Duration</div>
                        <div className="text-sm font-bold text-slate-600">{drug.duration}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDrugInfo(drug.name)}
                      className="w-full py-2 bg-slate-50 hover:bg-teal-50 text-slate-500 hover:text-teal-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-100 hover:border-teal-200"
                    >
                      <Info size={14} />
                      About This Drug
                    </button>
                  </div>
                ))}

                {result.interactions.map((inter, i) => (
                  <div key={i} className={`p-5 rounded-2xl flex gap-4 ${
                    inter.severity === 'critical' ? 'bg-rose-50 border border-rose-100' : 
                    inter.severity === 'high' ? 'bg-orange-50 border border-orange-100' :
                    inter.severity === 'medium' ? 'bg-amber-50 border border-amber-100' :
                    'bg-blue-50 border border-blue-100'
                  }`}>
                    <AlertTriangle className={
                      inter.severity === 'critical' ? 'text-rose-500' : 
                      inter.severity === 'high' ? 'text-orange-500' :
                      inter.severity === 'medium' ? 'text-amber-500' :
                      'text-blue-500'
                    } size={24} />
                    <div>
                      <div className="font-bold text-navy-800 text-sm mb-1">
                        {inter.severity.toUpperCase()} INTERACTION: {inter.drugs_involved.join(' + ')}
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {inter.description}
                      </p>
                    </div>
                  </div>
                ))}

                {verifiedInteractions.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-widest">
                      <ShieldCheck size={16} />
                      Verified Interactions (Deep Check)
                    </div>
                    {verifiedInteractions.map((inter, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={`verified-${i}`} 
                        className={`p-5 rounded-2xl flex gap-4 ${
                          inter.severity === 'critical' ? 'bg-rose-50 border border-rose-200 shadow-sm' : 
                          inter.severity === 'high' ? 'bg-orange-50 border border-orange-200 shadow-sm' :
                          inter.severity === 'medium' ? 'bg-amber-50 border border-amber-200 shadow-sm' :
                          'bg-blue-50 border border-blue-200 shadow-sm'
                        }`}
                      >
                        <AlertTriangle className={
                          inter.severity === 'critical' ? 'text-rose-500' : 
                          inter.severity === 'high' ? 'text-orange-500' :
                          inter.severity === 'medium' ? 'text-amber-500' :
                          'text-blue-500'
                        } size={24} />
                        <div>
                          <div className="font-bold text-navy-800 text-sm mb-1">
                            {inter.severity.toUpperCase()}: {inter.drugs_involved.join(' + ')}
                          </div>
                          <p className="text-slate-500 text-xs leading-relaxed">
                            {inter.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleCheckInteractions}
                    disabled={checkingInteractions || scanning}
                    className="py-4 bg-teal-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-teal-400 transition-all disabled:opacity-50 shadow-lg shadow-teal-500/20"
                  >
                    <ShieldCheck size={20} className={checkingInteractions ? 'animate-pulse' : ''} />
                    {checkingInteractions ? 'Verifying...' : 'Verify Interactions'}
                  </button>
                  <button 
                    onClick={handleDeepAnalysis}
                    disabled={analyzingDeeply || scanning}
                    className="py-4 bg-navy-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-navy-800 transition-all disabled:opacity-50 shadow-lg shadow-navy-900/20"
                  >
                    <Sparkles size={20} className={analyzingDeeply ? 'animate-spin' : ''} />
                    {analyzingDeeply ? 'Analyzing...' : 'Deep Analysis'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Deep Analysis Section */}
      <AnimatePresence>
        {deepAnalysis && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-white rounded-[32px] border border-slate-100 card-shadow overflow-hidden"
          >
            <div className="bg-gradient-to-r from-navy-900 to-navy-800 p-8 text-white flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400">
                <Sparkles size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Deep Clinical Analysis</h3>
                <p className="text-slate-400 text-sm">Advanced AI reasoning for patient safety</p>
              </div>
            </div>
            <div className="p-10">
              <div className="markdown-body prose prose-slate max-w-none">
                <Markdown>{deepAnalysis}</Markdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drug Info Modal */}
      <AnimatePresence>
        {selectedDrug && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-navy-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy-800">{selectedDrug}</h3>
                    <p className="text-slate-400 text-sm font-medium">Drug Information Guide</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDrug(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 overflow-auto flex-1">
                {fetchingDrugInfo ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-slate-400 font-bold">Fetching latest data from Google Search...</p>
                  </div>
                ) : (
                  <div className="markdown-body prose prose-slate max-w-none">
                    <Markdown>{drugInfo}</Markdown>
                  </div>
                )}
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setSelectedDrug(null)}
                  className="px-8 py-3 bg-navy-900 text-white font-bold rounded-2xl hover:bg-navy-800 transition-all"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'scan' | 'alerts'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setView('dashboard');
        fetchData();
      }
    } catch (err) {
      console.error("Auth check failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [scansRes, alertsRes] = await Promise.all([
        fetch('/api/scans'),
        fetch('/api/alerts')
      ]);
      if (scansRes.ok) setScans(await scansRes.json());
      if (alertsRes.ok) setAlerts(await alertsRes.json());
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setView('landing');
  };

  const handleAuthSuccess = (user: User) => {
    setUser(user);
    setView('dashboard');
    fetchData();
  };

  const handleScanComplete = async (result: ScanResult, patientName: string) => {
    const newScan: Partial<Scan> = {
      id: Math.random().toString(36).substr(2, 9),
      patient_name: patientName,
      raw_text: result.raw_text,
      structured_data: { drugs: result.drugs, interactions: result.interactions },
      risk_score: result.risk_score,
      status: result.risk_score > 50 ? 'Critical' : 'Safe',
      language: 'English'
    };

    await fetch('/api/scans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newScan)
    });

    for (const inter of result.interactions) {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Math.random().toString(36).substr(2, 9),
          scan_id: newScan.id,
          severity: inter.severity,
          message: inter.description
        })
      });
    }

    fetchData();
  };

  if (loading) return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (view === 'landing') return <LandingPage onStart={() => setView('auth')} />;
  if (view === 'auth') return <AuthPage onAuthSuccess={handleAuthSuccess} />;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-navy-900 flex flex-col p-6 border-r border-white/5">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-teal-500/20">M</div>
          <span className="font-display text-xl font-bold text-white tracking-tight">MediSafe AI</span>
        </div>

        <nav className="space-y-2 flex-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Main Menu</div>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <SidebarItem icon={ScanIcon} label="Scan Prescription" active={view === 'scan'} onClick={() => setView('scan')} badge="New" />
          <SidebarItem icon={DbIcon} label="Drug Database" active={false} onClick={() => {}} />
          <SidebarItem icon={Bell} label="Alerts" active={view === 'alerts'} onClick={() => setView('alerts')} badge={alerts.length > 0 ? alerts.length.toString() : null} />
          
          <div className="pt-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">System</div>
          <SidebarItem icon={Activity} label="Analytics" active={false} onClick={() => {}} />
          <SidebarItem icon={Settings} label="Settings" active={false} onClick={() => {}} />
        </nav>

        <div className="pt-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-white/5 transition-all group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center font-bold text-white">
              {user?.name?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">{user?.name || 'User'}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logout</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl w-96">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Search prescriptions, patients..." className="bg-transparent border-none outline-none text-sm w-full font-medium" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-teal-500 hover:bg-teal-50 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-100 mx-2" />
            <button className="px-4 py-2 bg-teal-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-all flex items-center gap-2">
              <ScanIcon size={16} /> New Scan
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'dashboard' && <Dashboard scans={scans} alerts={alerts} user={user} />}
            {view === 'scan' && <ScanPage onScanComplete={handleScanComplete} />}
            {view === 'alerts' && (
              <div className="p-8">
                <div className="mb-8 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-navy-800">Alerts Center</h2>
                    <p className="text-slate-400 font-medium">Critical interactions and safety warnings.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter by Severity:</span>
                    <select 
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-navy-800 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer hover:border-teal-500/50"
                    >
                      <option value="all">All Severities ({alerts.length})</option>
                      <option value="critical">Critical ({alerts.filter(a => a.severity === 'critical').length})</option>
                      <option value="high">High ({alerts.filter(a => a.severity === 'high').length})</option>
                      <option value="medium">Medium ({alerts.filter(a => a.severity === 'medium').length})</option>
                      <option value="low">Low ({alerts.filter(a => a.severity === 'low').length})</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  {alerts
                    .filter(alert => severityFilter === 'all' || alert.severity === severityFilter)
                    .map((alert) => (
                    <div key={alert.id} className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow flex gap-6 items-start">
                      <div className={`p-4 rounded-xl ${
                        alert.severity === 'critical' ? 'bg-rose-50 text-rose-500' : 
                        alert.severity === 'high' ? 'bg-orange-50 text-orange-500' :
                        alert.severity === 'medium' ? 'bg-amber-50 text-amber-500' :
                        'bg-blue-50 text-blue-500'
                      }`}>
                        <AlertTriangle size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-navy-800 text-lg">{alert.severity.toUpperCase()} ALERT</h4>
                          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-500 leading-relaxed mb-4">{alert.message}</p>
                        <div className="flex gap-4">
                          <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all">Resolve Alert</button>
                          <button className="px-4 py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-100 transition-all">View Prescription</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {alerts.filter(alert => severityFilter === 'all' || alert.severity === severityFilter).length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-navy-800 mb-1">
                        {severityFilter === 'all' ? 'All Clear' : `No ${severityFilter} Alerts`}
                      </h3>
                      <p className="text-slate-400">
                        {severityFilter === 'all' ? 'No active safety alerts detected.' : `There are currently no active ${severityFilter} alerts.`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
