
import { User, UserRole, Email, ProcessingStatus } from './types';

export const ADMIN_USER: User = {
  id: 'admin-001',
  email: 'cavid@gmail.com',
  accessCode: 'cavid123',
  role: UserRole.ADMIN,
  name: 'Cavid Admin',
  avatar: 'https://picsum.photos/seed/admin/200'
};

export const DEMO_USERS: User[] = [
  { id: 'u-1', email: 'user1@company.com', accessCode: 'demo123', role: UserRole.USER, name: 'Alex Thompson', avatar: 'https://picsum.photos/seed/u1/200' },
  { id: 'u-2', email: 'user2@beta.com', accessCode: 'beta456', role: UserRole.USER, name: 'Sarah Chen', avatar: 'https://picsum.photos/seed/u2/200' },
  { id: 'u-3', email: 'user3@gamma.com', accessCode: 'gamma789', role: UserRole.USER, name: 'Michael Ross', avatar: 'https://picsum.photos/seed/u3/200' },
  { id: 'u-4', email: 'user4@delta.io', accessCode: 'delta321', role: UserRole.USER, name: 'Elena Gilbert', avatar: 'https://picsum.photos/seed/u4/200' },
  { id: 'u-5', email: 'user5@omega.net', accessCode: 'omega654', role: UserRole.USER, name: 'Chris Evans', avatar: 'https://picsum.photos/seed/u5/200' },
  { id: 'u-6', email: 'user6@zeta.co', accessCode: 'zeta987', role: UserRole.USER, name: 'Natasha Romanoff', avatar: 'https://picsum.photos/seed/u6/200' }
];

const SUBJECTS = [
  "Invoice #4920 Pending", "Weekly Sync Meeting", "Security Update Required", 
  "New Project Alpha Specs", "Confidential: Q3 Results", "Employee Handbook 2024",
  "Urgent: Account Verification", "Purchase Order Approval", "Team Building Lunch",
  "Server Migration Schedule", "Customer Feedback Report", "Benefit Enrollment",
  "External: Job Opportunity", "Legacy System Patch", "Marketing Campaign Feedback",
  "API Key Rotation Notice", "Contract Renewal: Phase 2", "Payroll Adjustment",
  "Internal: Holiday Schedule", "Vendor Security Assessment"
];

const SENDERS = [
  "hr@enterprise.com", "finance@globex.io", "support@microsoft.com", 
  "it-admin@secure.net", "no-reply@amazon.com", "billing@services.co",
  "hacker@suspicious-link.xyz", "ceo@internal-comms.com", "marketing@ad-agency.net",
  "accounting@external-audit.com", "legal@corporate-counsel.io"
];

const BODIES = [
  "Please review the attached invoice for the recent cloud services migration. Payment is due by Friday.",
  "Your account was accessed from a new device in Moscow, Russia. If this wasn't you, reset your password.",
  "Attached is the payroll report for this month. Please keep this information strictly confidential.",
  "Hi team, just a reminder about our sync today. We need to discuss the Project Alpha timeline.",
  "Important: We are updating our hardware security policies. All employees must sign the new agreement.",
  "CONGRATULATIONS! You've won a $1000 Amazon gift card. Click the link to claim your prize immediately.",
  "The contract for the new vendor has arrived. Please review the terms before we finalize the deal.",
  "Emergency: Our main API gateway is down. We need the root access keys to restart the instance.",
  "Hey, are you free? I need you to purchase some gift cards for a client. I'll reimburse you later."
];

const generateRandomEmails = (): Email[] => {
  const emails: Email[] = [];
  let idCounter = 1;

  DEMO_USERS.forEach(user => {
    // Generate 23 incoming emails for each user
    for (let i = 0; i < 23; i++) {
      const risk = Math.floor(Math.random() * 100);
      let level: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
      if (risk > 85) level = 'Critical';
      else if (risk > 70) level = 'High';
      else if (risk > 40) level = 'Medium';

      const status: ProcessingStatus = risk > 70 ? 'blocked_admin_review' : 'pending';
      const sender = SENDERS[Math.floor(Math.random() * SENDERS.length)];
      const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
      const body = BODIES[Math.floor(Math.random() * BODIES.length)];

      emails.push({
        id: `e-gen-${idCounter++}`,
        sender,
        recipient: user.email,
        subject,
        body,
        timestamp: new Date(Date.now() - Math.random() * 1500000000), // Random time in last ~17 days
        riskScore: risk,
        threatLevel: level,
        direction: 'received',
        processingStatus: status,
        analysis: risk > 70 ? "Heuristic engine detected malicious patterns: Suspicious sender domain + urgency keywords." : "Email appears legitimate but contains standard business terminology.",
        suggestions: risk > 70 ? ['Quarantine immediately', 'Contact sender via secondary channel'] : ['No action needed'],
        riskFactors: { content: risk * 0.3, attachment: risk * 0.4, links: risk * 0.2, context: risk * 0.1 }
      });
    }

    // Generate 4 outgoing emails for each user
    for (let i = 0; i < 4; i++) {
      emails.push({
        id: `e-gen-${idCounter++}`,
        sender: user.email,
        recipient: SENDERS[Math.floor(Math.random() * SENDERS.length)],
        subject: `RE: ${SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)]}`,
        body: "Confirmed. I've updated the records accordingly. Let me know if you need anything else.",
        timestamp: new Date(Date.now() - Math.random() * 800000000),
        riskScore: 5,
        threatLevel: 'Low',
        direction: 'sent',
        processingStatus: 'accepted',
        analysis: 'Internal communication via verified endpoint.',
        suggestions: [],
        riskFactors: { content: 2, attachment: 0, links: 3, context: 0 }
      });
    }
  });

  return emails;
};

export const INITIAL_EMAILS: Email[] = generateRandomEmails();
