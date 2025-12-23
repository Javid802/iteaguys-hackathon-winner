
import React from 'react';
import { ActivityLog } from '../types';
import { Terminal, ShieldAlert, LogIn, Mail } from 'lucide-react';

interface ActivityLogsProps {
  logs: ActivityLog[];
}

const ActivityLogs: React.FC<ActivityLogsProps> = ({ logs }) => {
  const getIcon = (action: string) => {
    if (action.includes('Login')) return <LogIn size={14} className="text-indigo-500" />;
    if (action.includes('Email')) return <Mail size={14} className="text-emerald-500" />;
    return <Terminal size={14} className="text-slate-400" />;
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 font-mono text-sm overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
        <h3 className="text-slate-200 font-semibold flex items-center">
          <Terminal className="mr-2" size={18} />
          System Activity Logs
        </h3>
        <span className="flex items-center text-xs text-amber-500">
          <ShieldAlert size={14} className="mr-1" />
          Live Monitoring Active
        </span>
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start group">
            <div className="mt-1 mr-3 flex-shrink-0">
              {getIcon(log.action)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className="text-slate-600 text-xs">{log.ipAddress}</span>
              </div>
              <p className="text-slate-300">
                <span className="text-indigo-400">{log.userId}</span>: {log.action} - <span className="text-slate-500 italic">{log.details}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogs;
