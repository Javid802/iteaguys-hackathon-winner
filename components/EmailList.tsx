
import React, { useState } from 'react';
import { Email, ProcessingStatus } from '../types';
import RiskBadge from './RiskBadge';
import { Mail, Clock, User, FileText, ChevronDown, ChevronUp, ShieldAlert, CheckCircle, Target, XCircle, ShieldCheck, Lock, UserCheck } from 'lucide-react';

interface EmailListProps {
  emails: Email[];
  isAdmin?: boolean;
  onAction?: (emailId: string, action: ProcessingStatus) => void;
}

const FactorBar: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-1000 ${color}`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: ProcessingStatus }> = ({ status }) => {
  const config: Record<ProcessingStatus, { label: string, color: string, icon: any }> = {
    pending: { label: 'Pending Action', color: 'bg-slate-100 text-slate-600', icon: Clock },
    accepted: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-rose-100 text-rose-700', icon: XCircle },
    blocked_admin_review: { label: 'Needs Admin', color: 'bg-amber-100 text-amber-700', icon: ShieldAlert },
    approved_by_admin: { label: 'Admin Approved', color: 'bg-indigo-100 text-indigo-700', icon: ShieldCheck },
    rejected_by_admin: { label: 'Admin Blocked', color: 'bg-red-100 text-red-700', icon: Lock }
  };

  const { label, color, icon: Icon } = config[status];

  return (
    <div className={`flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-transparent ${color}`}>
      <Icon size={12} className="mr-1.5" />
      {label}
    </div>
  );
};

const EmailList: React.FC<EmailListProps> = ({ emails, isAdmin, onAction }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
        <Mail className="w-12 h-12 text-slate-200 mb-4" />
        <p className="text-slate-400 font-bold text-sm">Secure Channel Clear</p>
      </div>
    );
  }

  // Sort by date descending
  const sortedEmails = [...emails].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="space-y-4">
      {sortedEmails.map((email) => (
        <div 
          key={email.id} 
          className={`bg-white rounded-3xl border transition-all overflow-hidden ${expandedId === email.id ? 'border-indigo-200 shadow-2xl shadow-indigo-50 ring-4 ring-indigo-50/50' : 'border-slate-100 hover:border-indigo-100'}`}
        >
          <div 
            className="px-6 py-5 cursor-pointer flex items-center justify-between group"
            onClick={() => setExpandedId(expandedId === email.id ? null : email.id)}
          >
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${email.threatLevel === 'Critical' || email.threatLevel === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                {email.direction === 'sent' ? <Mail size={22} /> : <User size={22} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-black text-slate-800 text-sm truncate">
                    {email.sender}
                  </span>
                  <StatusBadge status={email.processingStatus} />
                  {isAdmin && (
                    <div className="flex items-center text-[9px] font-black text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      <UserCheck size={10} className="mr-1" />
                      Owner: {email.recipient.split('@')[0]}
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-500 truncate mt-1 font-bold">{email.subject}</div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <RiskBadge level={email.threatLevel} score={email.riskScore} />
              <div className="text-[10px] text-slate-300 font-black uppercase hidden lg:block tracking-widest">
                {new Date(email.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              {expandedId === email.id ? <ChevronUp size={20} className="text-indigo-400" /> : <ChevronDown size={20} className="text-slate-300" />}
            </div>
          </div>

          {expandedId === email.id && (
            <div className="px-6 pb-8 pt-2 animate-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-slate-50">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">From</h4>
                      <p className="text-xs font-bold text-slate-700">{email.sender}</p>
                    </div>
                    <div className="text-right">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">To</h4>
                      <p className="text-xs font-bold text-slate-700">{email.recipient}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Intercepted Content</h4>
                    <div className="bg-slate-50/80 p-6 rounded-3xl text-sm text-slate-700 leading-relaxed font-bold border border-slate-100">
                      {email.body}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  {onAction && email.direction === 'received' && (
                    <div className="flex flex-wrap gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      {isAdmin ? (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onAction(email.id, 'approved_by_admin'); }}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                          >
                            Approve Access
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onAction(email.id, 'rejected_by_admin'); }}
                            className="bg-red-100 text-red-700 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-200 transition-colors"
                          >
                            Quarantine/Reject
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            disabled={email.threatLevel === 'High' || email.threatLevel === 'Critical' || email.processingStatus !== 'pending'}
                            onClick={(e) => { e.stopPropagation(); onAction(email.id, 'accepted'); }}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              (email.threatLevel === 'High' || email.threatLevel === 'Critical' || email.processingStatus !== 'pending') 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100'
                            }`}
                          >
                            {email.processingStatus === 'accepted' ? 'Accepted' : 'Accept Email'}
                          </button>
                          <button 
                            disabled={email.processingStatus !== 'pending'}
                            onClick={(e) => { e.stopPropagation(); onAction(email.id, 'rejected'); }}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              email.processingStatus !== 'pending'
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                            }`}
                          >
                            {email.processingStatus === 'rejected' ? 'Rejected' : 'Reject'}
                          </button>
                          {(email.threatLevel === 'High' || email.threatLevel === 'Critical') && email.processingStatus !== 'approved_by_admin' && (
                            <div className="flex-1 flex items-center text-[10px] font-black text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                              <ShieldAlert size={14} className="mr-2" />
                              REQUIRES ADMIN APPROVAL
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {email.riskFactors && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                      <FactorBar label="Content" value={email.riskFactors.content} color="bg-indigo-500" />
                      <FactorBar label="File" value={email.riskFactors.attachment} color="bg-amber-500" />
                      <FactorBar label="Links" value={email.riskFactors.links} color="bg-rose-500" />
                      <FactorBar label="Context" value={email.riskFactors.context} color="bg-emerald-500" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div className="bg-indigo-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Target size={80} />
                    </div>
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center">
                      <ShieldAlert size={14} className="mr-2" />
                      Security Breakdown
                    </h4>
                    <p className="text-xs font-bold leading-relaxed text-indigo-100 mb-6">
                      {email.analysis}
                    </p>
                    
                    {email.suggestions && email.suggestions.length > 0 && (
                      <div className="space-y-2">
                        {email.suggestions.map((s, idx) => (
                          <div key={idx} className="flex items-center bg-indigo-900/50 p-3 rounded-2xl text-[10px] font-black text-white border border-indigo-800">
                            <CheckCircle size={14} className="mr-3 text-emerald-400 shrink-0" />
                            {s}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EmailList;
