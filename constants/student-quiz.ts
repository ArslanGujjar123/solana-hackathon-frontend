export type QuizChatMessage = {
  id: string
  role: "assistant" | "user"
  label: string
  message: string
  avatarUrl?: string
  avatarFallback?: string
}

export type QuizNavItem = {
  id: string
  label: string
  href: string
  isActive?: boolean
}

export type QuizOption = {
  id: string
  label: string
}

export type QuizQuestion = {
  id: string
  prompt: string
  options: QuizOption[]
}

export type QuizLegendItem = {
  id: string
  label: string
  className: string
}

export type QuizReviewOption = {
  id: string
  label: string
  status: "correct" | "incorrect" | "neutral"
}

export type QuizReviewItem = {
  id: string
  title: string
  options: QuizReviewOption[]
  explanation: string
}

export const QUIZ_BUILDER_HEADER = {
  title: "Quiz Builder",
}

export const QUIZ_BUILDER_INSTRUCTIONS = {
  title: "Quick Instructions",
  description:
    "Specify your subject, choose difficulty level, and set the number of questions.",
}

export const QUIZ_BUILDER_CHAT = {
  title: "Chat",
  inputPlaceholder: "Type a message...",
  sendLabel: "Send",
}

export const QUIZ_BUILDER_MESSAGES: QuizChatMessage[] = [
  {
    id: "assistant-1",
    role: "assistant",
    label: "AI Assistant",
    message:
      "Hello! I can help you build a custom quiz. What subject are we focusing on today?",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3_XweIHT1DsyAYebEHPWeaxaLZky0Ahei2SkaIb6Kpyu2uovhw1PtSqj_8Y0qN_xNUwylkPMTZo1D6MdZ9-1JHPVYIYynN5a5VTmV0rRst17ZU-L--dsbiWPREot2a4pZKkJnsb1JXC1inMEZ4XbDYA1sCqZCf61i57Oz0oAirGluDTb2YINs4eTkNcpYwqrnpZ5Y6vDyubnENK160UvJS1p4gbfgYtrWAXk31gMjEKGOrp4Miz92aW9wgqr7VcfFH1QUdc1hXQo",
    avatarFallback: "AI",
  },
  {
    id: "user-1",
    role: "user",
    label: "You",
    message: "I'd like to create a 10-question quiz about Renaissance Art.",
  },
]

export const QUIZ_LOADING = {
  title: "Generating Quiz",
  subtitle: "Preparing your questions and answer choices.",
}

export const QUIZ_INTERFACE = {
  questionLabel: "Question",
  ofLabel: "of",
  timerLabel: "14:32",
  previousLabel: "Previous",
  flagLabel: "Flag",
  nextLabel: "Next Question",
  mapTitle: "Question Map",
  finishLabel: "Finish Quiz",
}

export const QUIZ_REVIEW = {
  title: "Quiz Results",
  scoreLabel: "Overall Score",
  scoreValue: "85%",
  scorePercent: 85,
  totalLabel: "Total Questions",
  totalValue: "20",
  correctLabel: "Correct",
  correctValue: "17",
  incorrectLabel: "Incorrect",
  incorrectValue: "3",
  timeLabel: "Time Taken",
  timeValue: "25 min",
  reviewTitle: "Question Review",
  retakeLabel: "Retake Quiz",
  backLabel: "Back to Dashboard",
  explanationLabel: "AI Explanation",
}

export const QUIZ_NAV_ITEMS: QuizNavItem[] = [
  { id: "home", label: "Home", href: "#" },
  { id: "practice", label: "Practice", href: "#" },
  { id: "review", label: "Review", href: "#" },
  { id: "groups", label: "Study Groups", href: "#" },
  { id: "help", label: "Help", href: "#" },
]

export const QUIZ_MAP_LEGEND: QuizLegendItem[] = [
  {
    id: "answered",
    label: "Answered",
    className: "bg-primary/10 border border-primary/20",
  },
  {
    id: "current",
    label: "Current",
    className: "bg-accent/20 border border-accent/30",
  },
  {
    id: "unanswered",
    label: "Unanswered",
    className: "bg-muted border border-border",
  },
]

export const QUIZ_INITIAL_ANSWERED_IDS = [1, 2, 3, 4]

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Which of the following best describes Renaissance art?",
    options: [
      { id: "q1-a", label: "Focus on abstract expressionism" },
      { id: "q1-b", label: "Revival of classical ideas and realism" },
      { id: "q1-c", label: "Exclusive use of digital media" },
      { id: "q1-d", label: "Minimalism and monochrome palettes" },
    ],
  },
  {
    id: "q2",
    prompt: "Who is considered a key figure of the High Renaissance?",
    options: [
      { id: "q2-a", label: "Leonardo da Vinci" },
      { id: "q2-b", label: "Andy Warhol" },
      { id: "q2-c", label: "Pablo Picasso" },
      { id: "q2-d", label: "Jackson Pollock" },
    ],
  },
  {
    id: "q3",
    prompt: "What technique creates the illusion of depth through light and shadow?",
    options: [
      { id: "q3-a", label: "Pointillism" },
      { id: "q3-b", label: "Chiaroscuro" },
      { id: "q3-c", label: "Cubism" },
      { id: "q3-d", label: "Collage" },
    ],
  },
  {
    id: "q4",
    prompt: "Which patron family supported many Renaissance artists in Florence?",
    options: [
      { id: "q4-a", label: "The Medici" },
      { id: "q4-b", label: "The Tudors" },
      { id: "q4-c", label: "The Bourbons" },
      { id: "q4-d", label: "The Habsburgs" },
    ],
  },
  {
    id: "q5",
    prompt:
      "Which of the following is NOT a characteristic of a well-designed user interface?",
    options: [
      { id: "q5-a", label: "Consistency in design elements" },
      { id: "q5-b", label: "Clear and concise information architecture" },
      { id: "q5-c", label: "Overuse of animations and transitions" },
      { id: "q5-d", label: "Intuitive navigation and user flow" },
    ],
  },
  {
    id: "q6",
    prompt: "Which medium was commonly used for Renaissance frescoes?",
    options: [
      { id: "q6-a", label: "Wet plaster" },
      { id: "q6-b", label: "Digital canvas" },
      { id: "q6-c", label: "Metal engraving" },
      { id: "q6-d", label: "Plastic sheets" },
    ],
  },
  {
    id: "q7",
    prompt: "What does the term 'humanism' emphasize in Renaissance art?",
    options: [
      { id: "q7-a", label: "Religious symbolism only" },
      { id: "q7-b", label: "Human potential and individuality" },
      { id: "q7-c", label: "Abstract patterns" },
      { id: "q7-d", label: "Mechanical reproduction" },
    ],
  },
  {
    id: "q8",
    prompt: "Which architectural feature is typical of Renaissance design?",
    options: [
      { id: "q8-a", label: "Flying buttresses" },
      { id: "q8-b", label: "Classical columns and domes" },
      { id: "q8-c", label: "Steel-framed skyscrapers" },
      { id: "q8-d", label: "Glass curtain walls" },
    ],
  },
  {
    id: "q9",
    prompt: "Which artist painted the Sistine Chapel ceiling?",
    options: [
      { id: "q9-a", label: "Michelangelo" },
      { id: "q9-b", label: "Raphael" },
      { id: "q9-c", label: "Titian" },
      { id: "q9-d", label: "Caravaggio" },
    ],
  },
  {
    id: "q10",
    prompt: "Perspective in Renaissance art was used to create?",
    options: [
      { id: "q10-a", label: "Symbolic abstraction" },
      { id: "q10-b", label: "Spatial depth" },
      { id: "q10-c", label: "Motion blur" },
      { id: "q10-d", label: "Pop-art impact" },
    ],
  },
  {
    id: "q11",
    prompt: "Which city is often called the birthplace of the Renaissance?",
    options: [
      { id: "q11-a", label: "Venice" },
      { id: "q11-b", label: "Florence" },
      { id: "q11-c", label: "Paris" },
      { id: "q11-d", label: "Rome" },
    ],
  },
  {
    id: "q12",
    prompt: "What is 'sfumato' most closely associated with?",
    options: [
      { id: "q12-a", label: "Sharp outlines" },
      { id: "q12-b", label: "Soft transitions between tones" },
      { id: "q12-c", label: "Geometric abstraction" },
      { id: "q12-d", label: "Bold typography" },
    ],
  },
  {
    id: "q13",
    prompt: "Which invention helped spread Renaissance ideas quickly?",
    options: [
      { id: "q13-a", label: "Printing press" },
      { id: "q13-b", label: "Steam engine" },
      { id: "q13-c", label: "Telegraph" },
      { id: "q13-d", label: "Telephone" },
    ],
  },
  {
    id: "q14",
    prompt: "Which theme became more common in Renaissance art?",
    options: [
      { id: "q14-a", label: "Mythological subjects" },
      { id: "q14-b", label: "Abstract color fields" },
      { id: "q14-c", label: "Industrial landscapes" },
      { id: "q14-d", label: "Digital pop culture" },
    ],
  },
  {
    id: "q15",
    prompt: "Renaissance artists emphasized which of the following?",
    options: [
      { id: "q15-a", label: "Flat symbolic figures" },
      { id: "q15-b", label: "Naturalistic anatomy" },
      { id: "q15-c", label: "Cubist forms" },
      { id: "q15-d", label: "Minimal ornamentation" },
    ],
  },
  {
    id: "q16",
    prompt: "Which sculptor created the statue of David?",
    options: [
      { id: "q16-a", label: "Donatello" },
      { id: "q16-b", label: "Michelangelo" },
      { id: "q16-c", label: "Bernini" },
      { id: "q16-d", label: "Rodin" },
    ],
  },
  {
    id: "q17",
    prompt: "What does the term 'Renaissance' literally mean?",
    options: [
      { id: "q17-a", label: "Rebirth" },
      { id: "q17-b", label: "Revolution" },
      { id: "q17-c", label: "Restoration" },
      { id: "q17-d", label: "Reformation" },
    ],
  },
  {
    id: "q18",
    prompt: "Which painter is known for the School of Athens fresco?",
    options: [
      { id: "q18-a", label: "Raphael" },
      { id: "q18-b", label: "Botticelli" },
      { id: "q18-c", label: "Giotto" },
      { id: "q18-d", label: "Vermeer" },
    ],
  },
  {
    id: "q19",
    prompt: "Renaissance art is characterized by which approach to perspective?",
    options: [
      { id: "q19-a", label: "Linear perspective" },
      { id: "q19-b", label: "Flattened perspective" },
      { id: "q19-c", label: "Isometric projection" },
      { id: "q19-d", label: "No perspective" },
    ],
  },
  {
    id: "q20",
    prompt: "Which Renaissance artist wrote extensively about art theory?",
    options: [
      { id: "q20-a", label: "Alberti" },
      { id: "q20-b", label: "Goya" },
      { id: "q20-c", label: "Monet" },
      { id: "q20-d", label: "Kandinsky" },
    ],
  },
]

export const QUIZ_REVIEW_ITEMS: QuizReviewItem[] = [
  {
    id: "review-1",
    title:
      "Question 1: What process do plants use to convert light energy into chemical energy?",
    options: [
      { id: "review-1-a", label: "A. Photosynthesis", status: "incorrect" },
      { id: "review-1-b", label: "B. Respiration", status: "correct" },
      { id: "review-1-c", label: "C. Transpiration", status: "neutral" },
      { id: "review-1-d", label: "D. Fermentation", status: "neutral" },
    ],
    explanation:
      "Plants use respiration to convert light energy into chemical energy, not photosynthesis. This is a common misconception; while photosynthesis captures energy, respiration releases it for use.",
  },
  {
    id: "review-2",
    title:
      "Question 2: Which organelle is responsible for cellular respiration in eukaryotic cells?",
    options: [
      { id: "review-2-a", label: "A. Nucleus", status: "neutral" },
      { id: "review-2-b", label: "B. Ribosome", status: "neutral" },
      { id: "review-2-c", label: "C. Mitochondria", status: "correct" },
      { id: "review-2-d", label: "D. Golgi apparatus", status: "neutral" },
    ],
    explanation:
      "Mitochondria are indeed the powerhouses of the cell, responsible for cellular respiration. They generate most of the cell's supply of adenosine triphosphate (ATP).",
  },
  {
    id: "review-3",
    title: "Question 3: What is the primary product of photosynthesis?",
    options: [
      { id: "review-3-a", label: "A. Carbon dioxide", status: "neutral" },
      { id: "review-3-b", label: "B. Glucose", status: "correct" },
      { id: "review-3-c", label: "C. Water", status: "neutral" },
      { id: "review-3-d", label: "D. Nitrogen", status: "neutral" },
    ],
    explanation:
      "Glucose is the sugar produced during photosynthesis, serving as the plant's main energy source and the foundation of most food chains.",
  },
]
