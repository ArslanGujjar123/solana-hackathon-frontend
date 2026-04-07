export type StudentDashboardOverviewCardId =
  | "project"
  | "sprint"
  | "tasks";

export type StudentDashboardOverviewCard = {
  id: StudentDashboardOverviewCardId;
  label: string;
  value: string;
  helperText: string;
  href: string;
};

export const STUDENT_DASHBOARD_HEADER = {
  eyebrow: "Student",
  title: "Dashboard",
  subtitle:
    "See your FYP project, sprint progress, and upcoming evaluations at a glance.",
};

export const STUDENT_DASHBOARD_OVERVIEW_CARDS: StudentDashboardOverviewCard[] =
  [
    {
      id: "project",
      label: "Current project",
      value: "FYP-001 - Recommendation System",
      helperText: "Linked with your FYP group and advisor.",
      href: "/dashboard/student/my-project",
    },
    {
      id: "sprint",
      label: "Active sprint",
      value: "Sprint 3 - Implementation",
      helperText: "Ends in 5 days - 3 tasks remaining.",
      href: "/dashboard/student/sprints",
    },
    {
      id: "tasks",
      label: "My tasks",
      value: "2 in progress - 4 open",
      helperText: "Keep your sprint board up to date.",
      href: "/dashboard/student/sprints",
    },
  ];

export const STUDENT_DASHBOARD_PROJECT_PROGRESS = {
  title: "Project progress",
  subtitle: "From all phases",
  valuePercent: 95,
  helperText: "Based on checklist",
  emoji: "🙂",
};

export const STUDENT_DASHBOARD_CURRENT_SPRINT = {
  name: "Sprint 3 - Implementation",
  dateLabel: "Mar 2 - Mar 15",
  helperText: "Focused on core feature implementation.",
};

export type StudentDashboardTaskStatus =
  | "Backlog"
  | "To_Do"
  | "In_Progress"
  | "Completed";

export const STUDENT_DASHBOARD_TASK_STATUSES: StudentDashboardTaskStatus[] = [
  "Backlog",
  "To_Do",
  "In_Progress",
  "Completed",
];

export const STUDENT_DASHBOARD_TASK_STATUS_LABEL: Record<
  StudentDashboardTaskStatus,
  string
> = {
  Backlog: "Backlog",
  To_Do: "To Do",
  In_Progress: "In Progress",
  Completed: "Completed",
};

export type StudentDashboardTask = {
  id: string;
  title: string;
  description: string;
  status: StudentDashboardTaskStatus;
  sprintName: string;
  dueLabel: string;
  assignedToLabel: string;
  createdAtLabel: string;
  updatedAtLabel: string;
};

export const STUDENT_DASHBOARD_TASKS: StudentDashboardTask[] = [
  {
    id: "task-1",
    title: "Refine project requirements with advisor",
    description: "Review initial requirements and clarify scope with your advisor.",
    status: "Backlog",
    sprintName: "Sprint 4 - Planning",
    dueLabel: "Planned",
    assignedToLabel: "Assigned to you",
    createdAtLabel: "Created Mar 18",
    updatedAtLabel: "Updated Mar 18",
  },
  {
    id: "task-2",
    title: "Implement dataset pre-processing pipeline",
    description: "Clean and normalize raw CSV data for the model.",
    status: "In_Progress",
    sprintName: "Sprint 3 - Implementation",
    dueLabel: "Due in 2 days",
    assignedToLabel: "Assigned to you",
    createdAtLabel: "Created Mar 5",
    updatedAtLabel: "Updated Mar 10",
  },
  {
    id: "task-3",
    title: "Update project journal and progress report",
    description: "Document sprint work and decisions in the project journal.",
    status: "To_Do",
    sprintName: "Sprint 3 - Implementation",
    dueLabel: "Due this week",
    assignedToLabel: "Assigned to you",
    createdAtLabel: "Created Mar 7",
    updatedAtLabel: "Updated Mar 7",
  },
  {
    id: "task-4",
    title: "Prepare slides for internal evaluation",
    description: "Summarize objectives, approach, and current results.",
    status: "To_Do",
    sprintName: "Sprint 3 - Implementation",
    dueLabel: "Due next week",
    assignedToLabel: "Assigned to you",
    createdAtLabel: "Created Mar 9",
    updatedAtLabel: "Updated Mar 9",
  },
  {
    id: "task-5",
    title: "Literature review summary",
    description: "Compile key findings from related research papers.",
    status: "Completed",
    sprintName: "Sprint 2 - Design",
    dueLabel: "Completed",
    assignedToLabel: "Assigned to you",
    createdAtLabel: "Created Feb 20",
    updatedAtLabel: "Updated Feb 28",
  },
];

export type StudentDashboardMeeting = {
  id: string;
  title: string;
  dateLabel: string;
  typeLabel: string;
};

export const STUDENT_DASHBOARD_MEETINGS: StudentDashboardMeeting[] = [
  {
    id: "meeting-1",
    title: "Weekly sync with advisor",
    dateLabel: "Tomorrow at 3:00 PM",
    typeLabel: "Online",
  },
  {
    id: "meeting-2",
    title: "Sprint 3 review with coordinator",
    dateLabel: "In 5 days at 11:00 AM",
    typeLabel: "Offline",
  },
];

export type StudentDashboardAnnouncement = {
  id: string;
  title: string;
  audienceLabel: string;
  dateLabel: string;
};

export const STUDENT_DASHBOARD_ANNOUNCEMENTS: StudentDashboardAnnouncement[] =
  [
    {
      id: "announcement-1",
      title: "Final evaluation rubric published",
      audienceLabel: "All FYP students",
      dateLabel: "Posted 2 days ago",
    },
    {
      id: "announcement-2",
      title: "Proposal resubmission window closes",
      audienceLabel: "Groups with pending proposals",
      dateLabel: "Closes in 3 days",
    },
  ];



