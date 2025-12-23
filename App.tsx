
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Email, ActivityLog, ProcessingStatus } from './types';
import { ADMIN_USER, DEMO_USERS, INITIAL_EMAILS } from './constants';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  // 1. Load the master users list from storage or defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mailguard_users');
    return saved ? JSON.parse(saved) : [ADMIN_USER, ...DEMO_USERS];
  });

  // 2. Load the current session, but we will sync its role later
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mailguard_current_user');
    if (saved) {
      const parsed = JSON.parse(saved) as User;
      // We don't just return 'parsed' because their role might have changed in the 'users' list
      return parsed;
    }
    return null;
  });

  const [emails, setEmails] = useState<Email[]>(() => {
    const saved = localStorage.getItem('mailguard_emails');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) }));
    }
    return INITIAL_EMAILS;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('mailguard_logs');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) }));
    }
    return [{
      id: 'l-1',
      userId: 'SYSTEM',
      action: 'System Boot',
      details: 'MAILGUARD.AI Security Engine initialized',
      timestamp: new Date(Date.now() - 36000000),
      ipAddress: '127.0.0.1'
    }];
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sync users list to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('mailguard_users', JSON.stringify(users));
  }, [users]);

  // Sync session to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mailguard_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mailguard_current_user');
    }
  }, [currentUser]);

  // IMPORTANT: Role Sync Effect
  // This ensures that if an Admin promotes a user, that user's active session 
  // picks up the new role immediately without needing to re-login.
  useEffect(() => {
    if (currentUser) {
      const latestUserData = users.find(u => u.id === currentUser.id);
      if (latestUserData && latestUserData.role !== currentUser.role) {
        setCurrentUser(latestUserData);
      }
    }
  }, [users, currentUser]);

  useEffect(() => {
    localStorage.setItem('mailguard_emails', JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem('mailguard_logs', JSON.stringify(logs));
  }, [logs]);

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
      // Find user in our persisted users state
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.accessCode === code);

      if (foundUser) {
        setCurrentUser(foundUser);
        addLog(foundUser.email, 'Login Success', `Authenticated as ${foundUser.role}`);
      } else {
        setLoginError('Invalid credentials. Check your email and access code.');
        addLog(email || 'Unknown', 'Login Failure', `Invalid attempt`);
      }
      setIsLoggingIn(false);
    }, 800);
  };

  const handleLogout = () => {
    if (currentUser) {
      addLog(currentUser.email, 'Logout', 'Session terminated');
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
    addLog(currentUser?.email || 'System', 'Email Processed', `Scan: ${newEmail.threatLevel} risk`);
  };

  const updateEmailStatus = (emailId: string, status: ProcessingStatus) => {
    setEmails(prev => prev.map(e => e.id === emailId ? { ...e, processingStatus: status } : e));
    addLog(currentUser?.email || 'System', 'Status Update', `Mail ${emailId} -> ${status}`);
  };

  const handleAddUser = (userData: Omit<User, 'id' | 'avatar'>) => {
    const newUser: User = {
      ...userData,
      id: `u-${Date.now()}`,
      avatar: `https://picsum.photos/seed/${Date.now()}/200`
    };
    
    setUsers(prev => [...prev, newUser]);
    addLog(currentUser?.email || 'Admin', 'User Created', `Provisioned ${newUser.email} as ${newUser.role}`);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    
    // If we're updating ourselves, update the session immediately
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    
    addLog(currentUser?.email || 'Admin', 'Privilege Update', `Changed ${updatedUser.email} to ${updatedUser.role}`);
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
      users={users}
      onAddUser={handleAddUser}
      onUpdateUser={handleUpdateUser}
    />
  );
};

export default App;
