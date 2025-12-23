
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  email: string;
  accessCode: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

export interface RiskFactors {
  content: number;
  attachment: number;
  links: number;
  context: number;
}

export type ProcessingStatus = 
  | 'pending' 
  | 'accepted' 
  | 'rejected' 
  | 'blocked_admin_review' 
  | 'approved_by_admin' 
  | 'rejected_by_admin';

export interface Email {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: Date;
  riskScore: number; // 0-100
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  analysis?: string;
  suggestions?: string[];
  riskFactors?: RiskFactors;
  attachment?: {
    name: string;
    type: string;
  };
  direction: 'sent' | 'received';
  processingStatus: ProcessingStatus;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  details: string;
  ipAddress: string;
}

export type DashboardTab = 'inbox' | 'sent' | 'send_email' | 'risk_alerts' | 'admin_panel' | 'audit_trail';
