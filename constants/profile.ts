// Profile Types and Constants

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  contactNumber: string;
  major: string;
  cgpa: string;
  bio: string;
  skills: string[];
  projectPreferences: {
    development: boolean;
    research: boolean;
    hybrid: boolean;
  };
  avatarUrl?: string;
}

export const MAJOR_OPTIONS = [
  "Bachelor of Computer Science (Hons)",
  "Bachelor of Software Engineering",
  "Bachelor of Information Systems",
  "Bachelor of Data Science",
] as const;

export const PROJECT_PREFERENCES = [
  {
    id: "development",
    label: "Development Projects",
    description: "Software, Web, Mobile Apps",
  },
  {
    id: "research",
    label: "Research Projects",
    description: "Algorithm study, Theoretical CS",
  },
  {
    id: "hybrid",
    label: "Hybrid Projects",
    description: "Research with prototype implementation",
  },
] as const;

// Mock data for development
export const MOCK_PROFILE: StudentProfile = {
  id: "1",
  firstName: "Alex",
  lastName: "Johnson",
  studentId: "19045823",
  email: "alex.j@uni.edu.my",
  contactNumber: "0312-3456789",
  major: "Bachelor of Computer Science (Hons)",
  cgpa: "3.75",
  bio: "Passionate about Artificial Intelligence and its application in healthcare. I am looking for a project that challenges my backend development skills while solving real-world problems.",
  skills: ["Python", "React.js", "Tailwind CSS", "Node.js", "Data Analysis"],
  projectPreferences: {
    development: true,
    research: false,
    hybrid: true,
  },
};
