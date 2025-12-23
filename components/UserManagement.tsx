
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { UserPlus, Shield, User as UserIcon, X, Check, Trash2, ShieldAlert, BadgeCheck, Eye, EyeOff, Key } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (userData: Omit<User, 'id' | 'avatar'>) => void;
  onUpdateUser: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onUpdateUser }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.USER);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [visibleCodes, setVisibleCodes] = useState<Record<string, boolean>>({});

  // Clean up success message after timeout
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const toggleCodeVisibility = (userId: string) => {
    setVisibleCodes(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (users.some(u => u.email === newEmail)) {
      setError('A user with this email already exists.');
      return;
    }

    if (newCode.length < 6) {
      setError('Access code must be at least 6 characters long.');
      return;
    }

    onAddUser({
      email: newEmail,
      name: newName,
      accessCode: newCode,
      role: newRole
    });

    setSuccess(`Identity provisioned successfully: ${newEmail}`);
    setNewEmail('');
    setNewName('');
    setNewCode('');
    setNewRole(UserRole.USER);
    
    setTimeout(() => {
      setShowAddForm(false);
    }, 1000);
  };

  const toggleRole = (user: User) => {
    const nextRole = user.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
    onUpdateUser({
      ...user,
      role: nextRole
    });
    setSuccess(`Privileges updated for ${user.name} to ${nextRole}`);
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-50 shadow-sm overflow-hidden">
      <div className="p-8 lg:p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Identity Management</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center">
            <BadgeCheck size={12} className="mr-1.5 text-emerald-500" />
            Directory of {users.length} active nodes
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {success && (
            <div className="hidden md:flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl animate-in fade-in slide-in-from-right-4">
              <Check size={14} className="mr-2" />
              {success}
            </div>
          )}
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-3 bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 font-black text-xs uppercase tracking-widest active:scale-95"
          >
            <UserPlus size={16} />
            <span>Provision User</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-widest">Identity</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-widest">Access Level</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-widest">Access Code</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl overflow-hidden mr-4 border-2 border-white shadow-md">
                      <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 leading-none">{u.name}</div>
                      <div className="text-[11px] font-bold text-slate-400 mt-1">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-colors ${u.role === UserRole.ADMIN ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                    {u.role === UserRole.ADMIN ? <Shield size={12} className="mr-1.5" /> : <UserIcon size={12} className="mr-1.5" />}
                    {u.role}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center space-x-3">
                    <code className="text-[11px] font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-md min-w-[80px] flex items-center">
                      <Key size={10} className="mr-2 opacity-30" />
                      {visibleCodes[u.id] ? u.accessCode : '••••••••'}
                    </code>
                    <button 
                      onClick={() => toggleCodeVisibility(u.id)}
                      className="text-slate-400 hover:text-slate-900 transition-colors"
                      title={visibleCodes[u.id] ? "Hide Code" : "Show Code"}
                    >
                      {visibleCodes[u.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-lg shadow-emerald-200"></div>
                    Verified
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button 
                    onClick={() => toggleRole(u)}
                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all border ${
                      u.role === UserRole.ADMIN 
                        ? 'text-slate-500 hover:text-slate-800 bg-slate-50 border-slate-100' 
                        : 'text-indigo-600 hover:text-indigo-800 bg-indigo-50 border-indigo-100/50 shadow-sm'
                    }`}
                  >
                    {u.role === UserRole.ADMIN ? 'Revoke Admin' : 'Make Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowAddForm(false)}></div>
          <div className="bg-white rounded-[40px] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-12 duration-500">
            <div className="h-2 bg-indigo-600"></div>
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Provision Identity</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manual Access Injection</p>
                </div>
                <button onClick={() => setShowAddForm(false)} className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Corporate Display Name</label>
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Workspace Email Address</label>
                    <input 
                      type="email" 
                      value={newEmail} 
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="user@enterprise.com"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Secure Access Code</label>
                    <input 
                      type="password" 
                      value={newCode} 
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="min 6 characters"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">System Privilege Level</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        type="button" 
                        onClick={() => setNewRole(UserRole.USER)}
                        className={`flex items-center justify-center py-3 rounded-2xl border-2 transition-all ${newRole === UserRole.USER ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                      >
                        <UserIcon size={16} className="mr-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Standard User</span>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setNewRole(UserRole.ADMIN)}
                        className={`flex items-center justify-center py-3 rounded-2xl border-2 transition-all ${newRole === UserRole.ADMIN ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-400'}`}
                      >
                        <Shield size={16} className="mr-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Admin Node</span>
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center animate-in fade-in slide-in-from-top-2">
                    <ShieldAlert size={16} className="text-red-600 mr-3" />
                    <p className="text-[10px] font-black text-red-700 uppercase">{error}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-100 text-[11px] uppercase tracking-[0.2em] active:scale-95 mt-4"
                >
                  Confirm Provisioning
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
