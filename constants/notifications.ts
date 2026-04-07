// Notification Types and Constants

export type NotificationType = "announcement" | "deadline" | "grade" | "message" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  fullContent?: string;
  timestamp: string;
  isRead: boolean;
  from?: string;
}

export const NOTIFICATION_TYPE_CONFIG: Record<
  NotificationType,
  { label: string; color: string; bgColor: string }
> = {
  announcement: {
    label: "Announcement",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  deadline: {
    label: "Deadline",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
  grade: {
    label: "Grade",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  message: {
    label: "Message",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  system: {
    label: "System",
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-950/30",
  },
};

// Mock data for development
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "announcement",
    title: "FYP Proposal Submission Deadline Extended",
    message: "The deadline for FYP proposal submission has been extended to January 20, 2026.",
    fullContent: "Dear Students,\n\nWe are pleased to inform you that the deadline for Final Year Project (FYP) proposal submission has been extended to January 20, 2026, at 11:59 PM.\n\nThis extension has been granted to provide students with additional time to refine their proposals and consult with potential advisors.\n\nPlease ensure that you submit your complete proposal through the student portal before the new deadline. Late submissions will not be accepted unless prior approval has been obtained from the FYP coordinator.\n\nIf you have any questions, please contact the FYP office.\n\nBest regards,\nFYP Coordination Office",
    timestamp: "2026-01-08T10:30:00Z",
    isRead: false,
    from: "FYP Coordination Office",
  },
  {
    id: "2",
    type: "deadline",
    title: "Sprint 2 Submission Due Tomorrow",
    message: "Sprint 2 deliverables are due tomorrow at 5:00 PM. Please submit all required documents.",
    fullContent: "Sprint 2 Submission Reminder:\n\nThis is a reminder that Sprint 2 deliverables are due tomorrow, January 9, 2026, at 5:00 PM.\n\nRequired deliverables:\n- Updated project documentation\n- Sprint 2 progress report\n- Code repository link with latest commits\n- Testing documentation\n- Sprint retrospective report\n\nEnsure all team members have reviewed the submission before the deadline.\n\nPenalties will apply for late submissions.",
    timestamp: "2026-01-08T09:15:00Z",
    isRead: false,
    from: "Project Management System",
  },
  {
    id: "3",
    type: "grade",
    title: "Proposal Evaluation Results Available",
    message: "Your FYP proposal evaluation results have been published. Check your grades section.",
    fullContent: "Proposal Evaluation Results:\n\nYour Final Year Project proposal has been evaluated by the review committee.\n\nOverall Score: 85/100\n\nBreakdown:\n- Problem Statement & Objectives: 18/20\n- Literature Review: 16/20\n- Methodology: 17/20\n- Technical Feasibility: 16/20\n- Timeline & Deliverables: 18/20\n\nFeedback from reviewers:\n\"Good problem identification with clear objectives. The methodology section could benefit from more technical details about the implementation approach. Overall, a solid proposal with minor areas for improvement.\"\n\nYou can now proceed to the next phase of your project. For detailed feedback, please schedule a meeting with your advisor.",
    timestamp: "2026-01-07T16:45:00Z",
    isRead: true,
    from: "Dr. Sarah Ahmed",
  },
  {
    id: "4",
    type: "message",
    title: "New Message from Advisor",
    message: "Dr. Rahman has sent you a message regarding your project progress.",
    fullContent: "Subject: Project Progress Review\n\nHi Alex,\n\nI've reviewed the progress report you submitted for Sprint 2. Overall, the work is progressing well, but I have a few suggestions:\n\n1. The AI model training section needs more documentation about the dataset preprocessing steps.\n2. Consider adding unit tests for the backend API endpoints.\n3. The UI mockups look great - proceed with the implementation.\n\nLet's schedule a meeting next week to discuss the upcoming Sprint 3 goals. Please check my available slots in the meeting scheduler and book a time that works for both of us.\n\nKeep up the good work!\n\nBest regards,\nDr. Rahman",
    timestamp: "2026-01-07T14:20:00Z",
    isRead: true,
    from: "Dr. Rahman",
  },
  {
    id: "5",
    type: "announcement",
    title: "FYP Showcase Event - Save the Date",
    message: "The annual FYP Showcase will be held on March 15, 2026. Start preparing your presentation.",
    fullContent: "FYP Showcase Event 2026\n\nDate: March 15, 2026\nTime: 9:00 AM - 5:00 PM\nVenue: University Main Auditorium\n\nWe are excited to announce the annual Final Year Project Showcase, where students will present their completed projects to faculty, industry partners, and fellow students.\n\nWhat to prepare:\n- Project poster (A1 size)\n- Live demonstration of your project\n- 10-minute presentation\n- Project documentation\n\nThis is an excellent opportunity to showcase your hard work and network with potential employers. Several tech companies will be attending as sponsors and recruiters.\n\nRegistration will open on February 1, 2026. More details will be shared soon.\n\nMark your calendars!",
    timestamp: "2026-01-06T11:00:00Z",
    isRead: true,
    from: "FYP Coordination Office",
  },
  {
    id: "6",
    type: "system",
    title: "System Maintenance Scheduled",
    message: "The student portal will undergo maintenance on January 10, 2026, from 12:00 AM to 4:00 AM.",
    fullContent: "Scheduled System Maintenance\n\nDate: January 10, 2026\nTime: 12:00 AM - 4:00 AM (UTC+8)\n\nThe GuideSync student portal will be temporarily unavailable during this maintenance window.\n\nMaintenance activities:\n- Database optimization\n- Security updates\n- Performance improvements\n- Bug fixes\n\nWhat this means for you:\n- You will not be able to access the portal during this time\n- Any ongoing submissions should be completed before 11:59 PM on January 9\n- The system will be back online by 4:00 AM\n\nWe apologize for any inconvenience this may cause. If you have urgent matters, please contact the IT support team.\n\nThank you for your understanding.",
    timestamp: "2026-01-06T08:30:00Z",
    isRead: true,
    from: "System Administrator",
  },
];
