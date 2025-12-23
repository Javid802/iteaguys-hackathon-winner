
import React, { useState, useMemo } from 'react';
import { User, UserRole, Email, ActivityLog, ProcessingStatus, DashboardTab } from '../types';
import EmailList from './EmailList';
import EmailComposer from './EmailComposer';
import AdminStats from './AdminStats';
import ActivityLogs from './ActivityLogs';
import UserManagement from './UserManagement';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { 
  Shield, 
  LayoutDashboard, 
  Mail, 
  Settings, 
  LogOut, 
  ShieldAlert, 
  Search, 
  Bell,
  ChevronRight,
  Send,
  Lock,
  Zap,
  Menu,
  X,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Users,
  Inbox,
  SendHorizontal,
  FileWarning,
  Activity,
  ShieldCheck,
  UserPlus
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  emails: Email[];
  onSendEmail: (email: Partial<Email>) => void;
  updateEmailStatus: (emailId: string, status: ProcessingStatus) => void;
  logs: ActivityLog[];
  users: User[];
  onAddUser: (userData: Omit<User, 'id' | 'avatar'>) => void;
  onUpdateUser: (user: User) => void;
}

const SecurityReceiptModal: React.FC<{ email: Email; onClose: () => void }> = ({ email, onClose }) => {
  const isSafe = email.riskScore < 40;
  const isBlocked = email.riskScore > 70;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="bg-white rounded-[40px] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-slate-100">
        <div className={`h-2 ${isBlocked ? 'bg-red-500' : isSafe ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
        
        <div className="p-10">
          <div className="flex justify-center mb-8">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center rotate-6 ${isBlocked ? 'bg-red-50 text-red-600' : isSafe ? 'bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-100' : 'bg-amber-50 text-amber-600 shadow-lg shadow-amber-100'}`}>
              {isBlocked ? <ShieldAlert size={40} /> : isSafe ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
            </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">
              {isBlocked ? 'Email Quarantined' : 'Security Analysis Complete'}
            </h3>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
              {isBlocked ? 'High Risk Detected - Blocked' : `Receipt ID: ${email.id.split('-')[1]}`}
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Level</span>
              <span className={`text-sm font-black uppercase ${isBlocked ? 'text-red-600' : isSafe ? 'text-emerald-600' : 'text-amber-600'}`}>
                {email.threatLevel} ({Math.round(email.riskScore)}%)
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">AI Assessment</span>
                <p className="text-xs font-bold text-slate-700 leading-relaxed italic">"{email.analysis}"</p>
              </div>

              {isBlocked && (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                  <p className="text-[10px] font-black text-red-700 uppercase leading-relaxed">
                    This email has been blocked and escalated to the Admin Review Panel for further investigation.
                  </p>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-xl shadow-slate-200 uppercase tracking-widest text-xs"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, emails, onSendEmail, updateEmailStatus, logs, users, onAddUser, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('inbox');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSentEmail, setLastSentEmail] = useState<Email | null>(null);
  
  const isAdmin = user.role === UserRole.ADMIN;

  const ownedEmails = useMemo(() => {
    if (isAdmin) return emails;
    return emails.filter(e => e.sender === user.email || e.recipient === user.email);
  }, [emails, user.email, isAdmin]);

  const displayedEmails = useMemo(() => {
    switch (activeTab) {
      case 'inbox':
        return ownedEmails.filter(e => e.direction === 'received');
      case 'sent':
        return ownedEmails.filter(e => e.direction === 'sent');
      case 'risk_alerts':
        return ownedEmails.filter(e => e.riskScore > 40);
      case 'admin_panel':
        return ownedEmails.filter(e => e.processingStatus === 'blocked_admin_review');
      case 'audit_trail':
        return ownedEmails;
      default:
        return ownedEmails;
    }
  }, [ownedEmails, activeTab]);

  const highRiskCount = useMemo(() => {
    return ownedEmails.filter(e => e.riskScore > 70).length;
  }, [ownedEmails]);

  const safetyIndex = useMemo(() => {
    if (ownedEmails.length === 0) return 100;
    const avgRisk = ownedEmails.reduce((acc, e) => acc + e.riskScore, 0) / ownedEmails.length;
    return (100 - avgRisk).toFixed(1);
  }, [ownedEmails]);

  const handleNewEmailSent = (emailData: Partial<Email>) => {
    const isBlocked = (emailData.riskScore || 0) > 70;
    const emailWithId = { 
      ...emailData, 
      id: `e-${Date.now()}`, 
      direction: 'sent',
      processingStatus: isBlocked ? 'blocked_admin_review' : 'accepted'
    } as Email;
    
    onSendEmail(emailWithId);
    setLastSentEmail(emailWithId);
    setShowReceipt(true);
    setActiveTab('sent');
  };

  const simulateAttack = () => {
    const attackEmail: Partial<Email> = {
      sender: 'it-security@malicious-node.net',
      recipient: user.email,
      subject: 'URGENT: Global API Key Compromise - Action Required',
      body: 'Multiple failed login attempts detected on your workspace. Please download the attached recovery_tool.zip and execute it to rotate your API keys and secure your account immediately.',
      attachment: { name: 'recovery_tool.zip', type: 'zip' },
      riskScore: 94,
      threatLevel: 'Critical' as 'Critical',
      analysis: 'Phishing signature detected: Urgent tone combined with executable attachment from an external untrusted domain.',
      suggestions: ['Blocked: Malware content signature', 'Quarantine attachment'],
      riskFactors: { content: 30, attachment: 50, links: 0, context: 14 },
      timestamp: new Date(),
      direction: 'received' as 'received',
      processingStatus: 'blocked_admin_review' as ProcessingStatus
    };
    onSendEmail(attackEmail);
    setActiveTab('risk_alerts');
  };

  const NavItem = ({ id, icon: Icon, label, adminOnly = false }: any) => {
    if (adminOnly && !isAdmin) return null;
    const active = activeTab === id;
    return (
      <button 
        onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-800'}`}
      >
        <div className="flex items-center">
          <Icon size={18} className="mr-4" />
          <span className="font-black text-xs uppercase tracking-widest">{label}</span>
        </div>
        {active && <ChevronRight size={14} />}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-medium">
      {showReceipt && lastSentEmail && (
        <SecurityReceiptModal email={lastSentEmail} onClose={() => setShowReceipt(false)} />
      )}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      <aside className={`fixed md:relative w-72 h-full bg-white border-r border-slate-100 z-50 transition-transform duration-300 ease-in-out shrink-0 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-6">
              <Shield size={22} />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-lg tracking-tighter">MAILGUARD</h2>
              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block">Simulation Mode</span>
            </div>
          </div>
          <button className="md:hidden text-slate-400" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-5 py-4">Navigation</div>
          <NavItem id="inbox" icon={Inbox} label="Inbox" />
          <NavItem id="sent" icon={SendHorizontal} label="Sent" />
          <NavItem id="send_email" icon={Send} label="Send Email" />
          
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-5 py-4 mt-4">Security Center</div>
          <NavItem id="risk_alerts" icon={FileWarning} label="Risk Alerts" />
          <NavItem id="admin_panel" icon={ShieldCheck} label="Admin Panel" adminOnly />
          <NavItem id="audit_trail" icon={Activity} label="Audit Trail" adminOnly />
        </nav>

        <div className="p-6">
          <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100">
             <div className="flex items-center mb-5">
                <div className="w-11 h-11 rounded-full border-4 border-white overflow-hidden shadow-lg mr-4 bg-white shrink-0">
                   <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                   <p className="text-sm font-black text-slate-900 leading-none truncate">{user.name}</p>
                   <p className="text-[9px] font-black text-indigo-500 uppercase mt-1">{user.role}</p>
                </div>
             </div>
             <button onClick={onLogout} className="w-full flex items-center justify-center py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-red-600 hover:border-red-100 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm">
              <LogOut size={14} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
        <header className="h-24 bg-white border-b border-slate-50 flex items-center justify-between px-8 shrink-0 z-30">
          <div className="flex items-center space-x-6">
            <button className="md:hidden p-3 bg-slate-50 rounded-2xl text-slate-900 shadow-sm" onClick={() => setIsMobileMenuOpen(true)}>
               <Menu size={20} />
            </button>
            <div className="hidden lg:flex items-center bg-slate-50 px-6 py-3 rounded-3xl border border-slate-100">
               <Search className="text-slate-400 mr-3" size={16} />
               <input type="text" placeholder="Search system..." className="bg-transparent text-[11px] font-black text-slate-900 outline-none w-64 placeholder-slate-300 uppercase tracking-widest" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={simulateAttack} className="hidden sm:flex items-center space-x-3 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-all shadow-xl shadow-red-100 group active:scale-95">
              <Zap size={16} className="group-hover:animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">Hackathon Simulation</span>
            </button>
            <div className="h-10 w-px bg-slate-100 mx-4 hidden sm:block"></div>
            <div className="relative p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 cursor-pointer rounded-2xl">
               <Bell size={20} />
               {highRiskCount > 0 && <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 border-4 border-white rounded-full"></span>}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {(activeTab === 'inbox' || activeTab === 'sent' || activeTab === 'risk_alerts') && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                   <div>
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter capitalize">{activeTab.replace('_', ' ')}</h2>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-3 flex items-center">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 shadow-lg shadow-emerald-200"></div>
                         Live Monitoring: {user.email}
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm col-span-1 lg:col-span-2 relative overflow-hidden">
                     <div className="flex justify-between items-start relative z-10">
                        <div>
                           <div className="flex items-center text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">
                              <TrendingUp size={14} className="mr-2" />
                              Personal Safety Index
                           </div>
                           <div className="text-4xl font-black text-slate-900 tracking-tighter">{safetyIndex}% Secure</div>
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Optimal</div>
                     </div>
                  </div>
                </div>

                <div className="pt-8">
                   <div className="flex items-center justify-between mb-10">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Communication Feed</h3>
                      <div className="flex items-center space-x-3 bg-white px-5 py-2 rounded-full border border-slate-100 shadow-sm">
                         <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Scan</span>
                      </div>
                   </div>
                   <EmailList 
                    emails={displayedEmails} 
                    isAdmin={isAdmin} 
                    onAction={(id, status) => updateEmailStatus(id, status)}
                   />
                </div>
              </div>
            )}

            {activeTab === 'send_email' && (
              <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="mb-12">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Send Email</h2>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em] mt-4">AI Real-time Content Interception Active</p>
                </div>
                <EmailComposer 
                  currentUserEmail={user.email} 
                  onSend={handleNewEmailSent} 
                />
              </div>
            )}

            {isAdmin && activeTab === 'admin_panel' && (
              <div className="animate-in fade-in duration-700">
                <div className="flex justify-between items-center mb-12">
                   <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Admin Review Panel</h2>
                   <div className="flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl border border-indigo-100 font-black text-xs uppercase tracking-widest">
                      <ShieldAlert size={16} className="mr-2" />
                      Global Infrastructure Control
                   </div>
                </div>
                
                <AdminStats 
                  totalMails={emails.length} 
                  highRiskMails={emails.filter(e => e.riskScore > 70).length}
                  threatsBlocked={emails.filter(e => e.processingStatus === 'rejected_by_admin').length}
                  activeUsers={users.length}
                />
                
                <div className="mt-16">
                  <UserManagement 
                    users={users} 
                    onAddUser={onAddUser} 
                    onUpdateUser={onUpdateUser} 
                  />
                </div>

                <div className="mt-16">
                  <h3 className="text-3xl font-black text-slate-900 mb-10 tracking-tighter">Escalated Communications</h3>
                  <EmailList 
                    emails={displayedEmails} 
                    isAdmin={true} 
                    onAction={(id, status) => updateEmailStatus(id, status)}
                  />
                </div>
              </div>
            )}

            {isAdmin && activeTab === 'audit_trail' && (
              <div className="animate-in fade-in duration-700">
                <h2 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter">Global Audit Trail</h2>
                <ActivityLogs logs={logs} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
