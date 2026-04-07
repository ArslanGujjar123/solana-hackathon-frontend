export type CreditPackage = {
  id: number
  name: string
  pricePkr: string
  credits: string
  expires: string
}

export const BUY_CREDITS_HEADER = {
  title: "Buy Credits",
}

export const BUY_CREDITS_INFO = {
  title: "How it works",
  description:
    "Choose the desired credit package and click \"Buy Credit\" to generate an invoice. Your account will be topped up upon confirmation.",
}

export const BUY_CREDITS_TABLE = {
  columns: ["#", "Package", "Price (PKR)", "Credits", "Expires", "Action"],
  actionLabel: "Buy Credit",
}

export const BUY_CREDITS_PACKAGES: CreditPackage[] = [
  { id: 1, name: "Nano", pricePkr: "500", credits: "2", expires: "30 days" },
  { id: 2, name: "Mini", pricePkr: "1,250", credits: "5", expires: "30 days" },
  { id: 3, name: "Flex", pricePkr: "2,500", credits: "10", expires: "30 days" },
]
