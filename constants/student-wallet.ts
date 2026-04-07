export type WalletStat = {
  id: string
  label: string
  value: string
}

export type WalletPurchase = {
  id: string
  packageName: string
  amountPkr: string
  creditsAdded: string
  date: string
}

export const STUDENT_WALLET_HEADER = {
  title: "My Wallet",
}

export const STUDENT_WALLET_BALANCE = {
  label: "Total Balance",
  value: "1,000 Credits",
  ctaLabel: "Top Up",
  bannerImageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDoDGifWxs71PWSXEcWeNJlteclT6aICWS4HXKEI4v2B1YhNP4Nb0sBSl170GIOFbeQht4xtt-g0Oo-RqLThcS9wmaWGiSvOHhgks01xbHzp_PThhP6hHGO0IQZWG9H-gTHOJAGXkosOTfG74jkEsxzb3duRRLNlVDr7jTtmafs6terVFsL8On4Tyl1uzGyyUkrGHogS_mSYUUVYUoLYS6ZMngx0xTL4brM7B0p55HUs6S8y8aeVPxLhmalgaznPgUiKu5J3CeifSY",
}

export const STUDENT_WALLET_STATS: WalletStat[] = [
  { id: "credits-used", label: "Total Credits Used", value: "500" },
  { id: "recent-purchases", label: "Recent Purchases", value: "2" },
]

export const STUDENT_WALLET_PURCHASES: WalletPurchase[] = [
  {
    id: "#12345",
    packageName: "Nano",
    amountPkr: "500",
    creditsAdded: "100",
    date: "2023-09-15",
  },
  {
    id: "#67890",
    packageName: "Mini",
    amountPkr: "1,000",
    creditsAdded: "250",
    date: "2023-09-10",
  },
  {
    id: "#11223",
    packageName: "Flex",
    amountPkr: "2,000",
    creditsAdded: "500",
    date: "2023-09-05",
  },
  {
    id: "#44556",
    packageName: "Nano",
    amountPkr: "500",
    creditsAdded: "100",
    date: "2023-08-30",
  },
  {
    id: "#77889",
    packageName: "Mini",
    amountPkr: "1,000",
    creditsAdded: "250",
    date: "2023-08-25",
  },
]
