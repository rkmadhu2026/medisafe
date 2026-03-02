export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Drug {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  confidence: number;
}

export interface Scan {
  id: string;
  patient_name: string;
  timestamp: string;
  raw_text: string;
  structured_data: {
    drugs: Drug[];
    interactions: {
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      drugs_involved: string[];
    }[];
  };
  risk_score: number;
  status: string;
  language: string;
}

export interface Alert {
  id: string;
  scan_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: number;
}
