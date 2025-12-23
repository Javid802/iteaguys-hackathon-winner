
import React, { useState } from 'react';
import { Send, Loader2, ShieldCheck, FileIcon, Sparkles, X } from 'lucide-react';
import { analyzeEmailRisk } from '../geminiService';
import { Email } from '../types';

interface EmailComposerProps {
  onSend: (email: Partial<Email>) => void;
  currentUserEmail: string;
}

const DEMO_SCENARIOS = [
  {
    recipient: 'finance@external-partner.com',
    subject: 'Project Alpha - Q2 Financials',
    body: 'Hi team, please find the confidential SSN list and passwords for the server access attached. My SSN is 000-11-2222.',
    attachment: 'passwords.docx'
  },
  {
    recipient: 'support@mailguard.ai',
    subject: 'Bug Report: UI Glitch',
    body: 'The dashboard looks great but I noticed a alignment issue on mobile screens.',
    attachment: 'screenshot.png'
  },
  {
    recipient: 'hr-portal@unverified.net',
    subject: 'Urgent: Benefit Enrollment',
    body: 'Click here immediately to update your bank details for the upcoming bonus payment: http://secure-verify-auth.xyz/login',
    attachment: 'urgent_update.zip'
  }
];

const EmailComposer: React.FC<EmailComposerProps> = ({ onSend, currentUserEmail }) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleMagicFill = () => {
    const scenario = DEMO_SCENARIOS[Math.floor(Math.random() * DEMO_SCENARIOS.length)];
    setRecipient(scenario.recipient);
    setSubject(scenario.subject);
    setBody(scenario.body);
    setAttachment(scenario.attachment);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !subject || !body) return;

    setIsScanning(true);
    const risk = await analyzeEmailRisk(subject, body, attachment);
    setIsScanning(false);

    onSend({
      sender: currentUserEmail,
      recipient,
      subject,
      body,
      attachment: attachment ? { name: attachment, type: attachment.split('.').pop() || 'file' } : undefined,
      ...risk,
      timestamp: new Date(),
      status: 'sent'
    });

    setRecipient('');
    setSubject('');
    setBody('');
    setAttachment('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
             <Send className="text-indigo-600" size={18} />
          </div>
          New Secure Message
        </h3>
        <button 
          onClick={handleMagicFill}
          className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
        >
          <Sparkles size={14} className="mr-1.5" />
          Magic Fill (Demo)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Recipient</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Attachment (Simulated)</label>
            <div className="relative">
              <FileIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="filename.ext"
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Subject</label>
          <input
            type="text"
            placeholder="Security update or Project discussion"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Message Body</label>
          <textarea
            rows={5}
            placeholder="Compose your secure message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm resize-none transition-all"
            required
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center text-xs font-medium text-slate-500">
            <ShieldCheck size={14} className="mr-2 text-emerald-500" />
            Active Scanner: <span className="ml-1 text-slate-800">B2B Edge v4.2</span>
          </div>
          <button
            type="submit"
            disabled={isScanning}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Scanning Content...
              </>
            ) : (
              <>
                <Send className="mr-2" size={18} />
                Send Securely
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailComposer;
