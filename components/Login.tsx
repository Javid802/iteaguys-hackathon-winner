
import React, { useState } from 'react';
import { Shield, Lock, Mail, Loader2, Info } from 'lucide-react';
import { ADMIN_USER, DEMO_USERS } from '../constants';

interface LoginProps {
  onLogin: (email: string, code: string) => void;
  isLoading: boolean;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, code);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl mb-6 shadow-2xl shadow-indigo-500/20 rotate-3">
            <Shield className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">MAILGUARD</h1>
          <p className="text-slate-400 mt-2 font-medium">B2B Security Control Center</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Access Code</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-3 px-4 rounded-xl flex items-center">
                <Info size={16} className="mr-2" />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform active:scale-[0.98] flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Authenticating...
                </>
              ) : (
                'Secure Login'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800">
            <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Demo Credentials</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-colors cursor-pointer group" onClick={() => {setEmail(ADMIN_USER.email); setCode(ADMIN_USER.accessCode)}}>
                <div className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Admin Access</div>
                <div className="text-xs text-slate-300 font-mono group-hover:text-indigo-300">cavid@gmail.com</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-colors cursor-pointer group" onClick={() => {setEmail(DEMO_USERS[0].email); setCode(DEMO_USERS[0].accessCode)}}>
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">User Access</div>
                <div className="text-xs text-slate-300 font-mono group-hover:text-indigo-300">user1@company.com</div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-slate-600 text-xs">
          Hackathon Demo Only &bull; Secured by MAILGUARD Edge Engine
        </p>
      </div>
    </div>
  );
};

export default Login;
