
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Shield, Mail, Users, AlertOctagon } from 'lucide-react';

interface StatsProps {
  totalMails: number;
  highRiskMails: number;
  threatsBlocked: number;
  activeUsers: number;
}

const AdminStats: React.FC<StatsProps> = ({ totalMails, highRiskMails, threatsBlocked, activeUsers }) => {
  const data = [
    { name: 'Mon', threats: 12, safe: 45 },
    { name: 'Tue', threats: 19, safe: 52 },
    { name: 'Wed', threats: 3, safe: 48 },
    { name: 'Thu', threats: 25, safe: 38 },
    { name: 'Fri', threats: 14, safe: 60 },
    { name: 'Sat', threats: 8, safe: 25 },
    { name: 'Sun', threats: 5, safe: 20 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-500 text-sm font-medium uppercase">Total Scanned</span>
          <Mail className="text-indigo-500" size={20} />
        </div>
        <div className="text-3xl font-bold text-slate-800">{totalMails}</div>
        <div className="text-xs text-emerald-500 font-medium mt-1">+12% from yesterday</div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-500 text-sm font-medium uppercase">Threats Detected</span>
          <AlertOctagon className="text-amber-500" size={20} />
        </div>
        <div className="text-3xl font-bold text-slate-800">{highRiskMails}</div>
        <div className="text-xs text-amber-500 font-medium mt-1">Requiring Attention</div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-500 text-sm font-medium uppercase">Automated Blocks</span>
          <Shield className="text-emerald-500" size={20} />
        </div>
        <div className="text-3xl font-bold text-slate-800">{threatsBlocked}</div>
        <div className="text-xs text-emerald-500 font-medium mt-1">99.9% Success Rate</div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-500 text-sm font-medium uppercase">Active Nodes</span>
          <Users className="text-slate-500" size={20} />
        </div>
        <div className="text-3xl font-bold text-slate-800">{activeUsers}</div>
        <div className="text-xs text-slate-400 font-medium mt-1">Live Sessions</div>
      </div>

      <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-4">
        <h4 className="text-slate-800 font-semibold mb-6">Threat Activity (7 Days)</h4>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
              />
              <Area type="monotone" dataKey="threats" stroke="#f43f5e" fillOpacity={1} fill="url(#colorThreats)" />
              <Area type="monotone" dataKey="safe" stroke="#6366f1" fillOpacity={1} fill="url(#colorSafe)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
