export type RankPaperCategory = {
  id: string
  title: string
  description: string
  imageUrl: string
  ctaLabel: string
}

export type RankPaperSelectOption = {
  value: string
  label: string
}

export type RankPaperConfigField = {
  id: string
  label: string
  placeholder: string
  options: RankPaperSelectOption[]
}

export type RankPaperConfigColumn = {
  id: string
  fields: RankPaperConfigField[]
}

export type RankPaperQuestion = {
  id: string
  prompt: string
}

export type RankPaperMcq = {
  id: string
  prompt: string
  options: string
}

export type RankPaperSection = {
  id: string
  title: string
  accentClass: string
  type: "mcq" | "short" | "long"
  items: Array<RankPaperMcq | RankPaperQuestion>
}

export type RankPaperAnalysisBar = {
  id: string
  label: string
  heightPercent: number
  toneClass: string
}

export const RANK_PAPER_HEADER = {
  title: "Rank Paper",
}

export const RANK_PAPER_CONFIG = {
  title: "Rank Paper Configuration",
  subtitle: "Configure the parameters for your AI ranking session",
  backLabel: "Back",
  submitLabel: "Rank",
  helperText: "System will generate a ranked evaluation based on these parameters.",
}

export const RANK_PAPER_LOADING = {
  title: "Generating Paper",
  subtitle: "Analyzing your settings and compiling ranked questions.",
}

export const RANK_PAPER_RESULT = {
  title: "Generated Paper",
  downloadLabel: "Download PDF",
  regenerateLabel: "Regenerate Paper",
  analysisTitle: "Question Analysis",
  analysisFilterPlaceholder: "Select section",
  frequencyLabel: "Question Frequency",
  frequencyValue: "100",
  comparisonLabel: "vs Last 10",
  comparisonDelta: "+12%",
  helperText: "System will generate a ranked evaluation based on these parameters.",
}

export const RANK_PAPER_ANALYSIS_FILTERS: RankPaperSelectOption[] = [
  { value: "mcqs", label: "MCQs" },
  { value: "short", label: "Short Questions" },
  { value: "long", label: "Long Questions" },
]

export const RANK_PAPER_SECTIONS: RankPaperSection[] = [
  {
    id: "mcqs",
    title: "MCQs",
    accentClass: "border-primary",
    type: "mcq",
    items: [
      {
        id: "mcq-1",
        prompt: "What is the primary function of the CPU in a computer system?",
        options:
          "(a) Storing data (b) Processing instructions (c) Displaying graphics (d) Managing network connections",
      },
      {
        id: "mcq-2",
        prompt: "Which programming language is commonly used for web development?",
        options: "(a) Java (b) Python (c) JavaScript (d) C++",
      },
      {
        id: "mcq-3",
        prompt: "What does HTML stand for?",
        options:
          "(a) Hypertext Markup Language (b) High-level Text Management Language (c) Hyperlink Text Manipulation Language (d) Home Tool Markup Language",
      },
    ],
  },
  {
    id: "short",
    title: "Short Questions",
    accentClass: "border-chart-2",
    type: "short",
    items: [
      {
        id: "short-1",
        prompt: "Explain the concept of object-oriented programming (OOP).",
      },
      {
        id: "short-2",
        prompt: "Describe the difference between a compiler and an interpreter.",
      },
      {
        id: "short-3",
        prompt: "What is the purpose of a database in a software application?",
      },
    ],
  },
  {
    id: "long",
    title: "Long Questions",
    accentClass: "border-chart-4",
    type: "long",
    items: [
      {
        id: "long-1",
        prompt:
          "Discuss the advantages and disadvantages of using cloud computing services.",
      },
      {
        id: "long-2",
        prompt:
          "Compare and contrast different types of data structures, such as arrays, linked lists, and trees.",
      },
      {
        id: "long-3",
        prompt:
          "Analyze the impact of artificial intelligence (AI) on various industries and the future of work.",
      },
    ],
  },
]

export const RANK_PAPER_ANALYSIS_BARS: RankPaperAnalysisBar[] = [
  { id: "q1", label: "Q1", heightPercent: 100, toneClass: "bg-primary" },
  { id: "q2", label: "Q2", heightPercent: 60, toneClass: "bg-primary/70" },
  { id: "q3", label: "Q3", heightPercent: 85, toneClass: "bg-primary/80" },
  { id: "q4", label: "Q4", heightPercent: 40, toneClass: "bg-primary/60" },
  { id: "q5", label: "Q5", heightPercent: 95, toneClass: "bg-primary/70" },
  { id: "q6", label: "Q6", heightPercent: 70, toneClass: "bg-primary/75" },
  { id: "q7", label: "Q7", heightPercent: 100, toneClass: "bg-primary" },
]

export const RANK_PAPER_CONFIG_COLUMNS: RankPaperConfigColumn[] = [
  {
    id: "left",
    fields: [
      {
        id: "grade",
        label: "Grade",
        placeholder: "Select Grade",
        options: [
          { value: "9", label: "Grade 9" },
          { value: "10", label: "Grade 10" },
          { value: "11", label: "Grade 11" },
          { value: "12", label: "Grade 12" },
        ],
      },
      {
        id: "subject",
        label: "Subject",
        placeholder: "Select Subject",
        options: [
          { value: "math", label: "Mathematics" },
          { value: "physics", label: "Physics" },
          { value: "chemistry", label: "Chemistry" },
          { value: "biology", label: "Biology" },
        ],
      },
    ],
  },
  {
    id: "right",
    fields: [
      {
        id: "mcqs",
        label: "Multiple Choice Questions (MCQs)",
        placeholder: "Select quantity",
        options: [
          { value: "10", label: "10 Questions" },
          { value: "20", label: "20 Questions" },
          { value: "30", label: "30 Questions" },
        ],
      },
      {
        id: "short",
        label: "Short Questions",
        placeholder: "Select quantity",
        options: [
          { value: "5", label: "5 Questions" },
          { value: "10", label: "10 Questions" },
        ],
      },
      {
        id: "long",
        label: "Long Questions",
        placeholder: "Select quantity",
        options: [
          { value: "2", label: "2 Questions" },
          { value: "3", label: "3 Questions" },
          { value: "5", label: "5 Questions" },
        ],
      },
    ],
  },
]

export const RANK_PAPER_CATEGORIES: RankPaperCategory[] = [
  {
    id: "matric-fsc",
    title: "Matric / FSC",
    description:
      "Grade 9-12 National Curriculum focused on local board standards.",
    imageUrl:
    "/FSC.jpg",
    ctaLabel: "Start Ranking",
  },
  {
    id: "o-a-level",
    title: "O / A Level",
    description:
      "International education from Cambridge & Edexcel examination boards.",
    imageUrl:
    "/O_level.png",
    ctaLabel: "Start Ranking",
  },
  {
    id: "ecat-mdcat",
    title: "ECAT / MDCAT",
    description:
      "Pre-admission preparation for Engineering & Medical universities.",
    imageUrl:
    "/mcat.jpg",
    ctaLabel: "Start Ranking",
  },
]
