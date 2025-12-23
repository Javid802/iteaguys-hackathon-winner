
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Email, ActivityLog, ProcessingStatus } from './types';
import { ADMIN_USER, DEMO_USERS, INITIAL_EMAILS } from './constants';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [emails, setEmails] = useState<Email[]>(INITIAL_EMAILS);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const initialLogs: ActivityLog[] = [
      {
        id: 'l-1',
        userId: 'SYSTEM',
        action: 'System Boot',
        details: 'MAILGUARD.AI Security Engine v2.5 initialized',
        timestamp: new Date(Date.now() - 36000000),
        ipAddress: '127.0.0.1'
      }
    ];
    setLogs(initialLogs);
  }, []);

  const addLog = useCallback((userId: string, action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId,
      action,
      details,
      timestamp: new Date(),
      ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.1.1`
    };
    setLogs(prev => [newLog, ...prev]);
  }, []);

  const handleLogin = (email: string, code: string) => {
    setIsLoggingIn(true);
    setLoginError(null);

    setTimeout(() => {
      let foundUser: User | undefined;
      
      if (email === ADMIN_USER.email && code === ADMIN_USER.accessCode) {
        foundUser = ADMIN_USER;
      } else {
        foundUser = DEMO_USERS.find(u => u.email === email && u.accessCode === code);
      }

      if (foundUser) {
        setCurrentUser(foundUser);
        addLog(foundUser.email, 'Login Success', `User ${foundUser.name} authenticated.`);
      } else {
        setLoginError('Invalid email or access code. Please try again.');
        addLog(email || 'Unknown', 'Login Failure', `Invalid credentials provided`);
      }
      setIsLoggingIn(false);
    }, 800);
  };

  const handleLogout = () => {
    if (currentUser) {
      addLog(currentUser.email, 'Logout', 'User session terminated');
    }
    setCurrentUser(null);
  };

  const handleSendEmail = (emailData: Partial<Email>) => {
    const newEmail: Email = {
      ...emailData as Email,
      id: emailData.id || `e-${Date.now()}`,
      processingStatus: emailData.processingStatus || 'pending'
    };
    setEmails(prev => [newEmail, ...prev]);
    addLog(currentUser?.email || 'System', 'Email Processed', `Security scan result: ${newEmail.threatLevel} risk [Status: ${newEmail.processingStatus}]`);
  };

  const updateEmailStatus = (emailId: string, status: ProcessingStatus) => {
    setEmails(prev => prev.map(e => e.id === emailId ? { ...e, processingStatus: status } : e));
    addLog(currentUser?.email || 'System', 'Status Update', `Mail ${emailId} changed to ${status}`);
  };

  if (!currentUser) {
    return (
      <Login 
        onLogin={handleLogin} 
        isLoading={isLoggingIn} 
        error={loginError} 
      />
    );
  }

  return (
    <Dashboard 
      user={currentUser} 
      onLogout={handleLogout}
      emails={emails}
      onSendEmail={handleSendEmail}
      updateEmailStatus={updateEmailStatus}
      logs={logs}
    />
  );
};

export default App;
