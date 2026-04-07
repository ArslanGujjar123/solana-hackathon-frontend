export type HistoryItemType = "paper" | "quiz"

export type StudentHistoryItem = {
  id: number
  type: HistoryItemType
  grade: string
  subject: string
  questions: number
}

export const STUDENT_HISTORY_HEADER = {
  title: "History",
  searchPlaceholder: "Search history...",
}

export const STUDENT_HISTORY_TABLE = {
  columns: [
    "ID",
    "Type",
    "Grade",
    "Subject",
    "Questions",
    "View",
    "Download",
  ],
  showingLabel: "Showing 10 of 42 results",
  previousLabel: "Previous",
  nextLabel: "Next",
}

export const STUDENT_HISTORY_ITEMS: StudentHistoryItem[] = [
  { id: 1, type: "paper", grade: "9th", subject: "Math", questions: 10 },
  { id: 2, type: "quiz", grade: "10th", subject: "Science", questions: 20 },
  { id: 3, type: "paper", grade: "11th", subject: "English", questions: 15 },
  { id: 4, type: "quiz", grade: "12th", subject: "History", questions: 25 },
  { id: 5, type: "paper", grade: "9th", subject: "Math", questions: 10 },
  { id: 6, type: "quiz", grade: "10th", subject: "Science", questions: 20 },
  { id: 7, type: "paper", grade: "11th", subject: "English", questions: 15 },
  { id: 8, type: "quiz", grade: "12th", subject: "History", questions: 25 },
  { id: 9, type: "paper", grade: "9th", subject: "Math", questions: 10 },
  { id: 10, type: "quiz", grade: "10th", subject: "Science", questions: 20 },
]
