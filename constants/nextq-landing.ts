export type NextQNavItem = {
  label: string
  href: string
}

export type NextQProduct = {
  title: string
  description: string
  imageUrl: string
}

export type NextQFeature = {
  title: string
  description: string
  icon: "analytics" | "adaptive" | "community"
}

export type NextQPricingPlan = {
  name: string
  price: string
  period?: string
  ctaLabel: string
  features: string[]
  isPopular?: boolean
}

export type NextQTestimonial = {
  name: string
  role: string
  quote: string
  rating: 4.5 | 5
  avatarUrl: string
}

export const NEXTQ_BRAND = {
  name: "NextQ",
  tagline: "AI-Powered Learning",
}

export const NEXTQ_SECTION_IDS = {
  products: "products",
  features: "features",
  pricing: "pricing",
  testimonials: "testimonials",
  contact: "contact",
}

export const NEXTQ_NAV_ITEMS: NextQNavItem[] = [
  { label: "Products", href: `#${NEXTQ_SECTION_IDS.products}` },
  { label: "Features", href: `#${NEXTQ_SECTION_IDS.features}` },
  { label: "Pricing", href: `#${NEXTQ_SECTION_IDS.pricing}` },
  { label: "Testimonials", href: `#${NEXTQ_SECTION_IDS.testimonials}` },
  { label: "Contact Us", href: `#${NEXTQ_SECTION_IDS.contact}` },
]

export const NEXTQ_HERO = {
  title: "Unlock Your Potential with",
  highlight: "AI-Powered",
  titleSuffix: "Learning",
  description:
    "NextQ is an innovative learning platform that leverages artificial intelligence to personalize your educational journey. Discover courses tailored to your unique learning style and goals.",
  ctaLabel: "Get Started for Free",
  backgroundImageUrl:
    "hero.png",
}

export const NEXTQ_ACTIONS = {
  signUpLabel: "Sign Up",
  loginLabel: "Login",
  viewPricingLabel: "View Pricing",
}

export const NEXTQ_SECTION_LABELS = {
  productsHeading: "Our Products",
  productsSubheading: "Explore personalized learning experiences built around your goals.",
  featuresHeading: "Key Features",
  featuresSubheading:
    "Explore the powerful features that make NextQ the ultimate learning companion.",
  pricingHeading: "Pricing Plans",
  testimonialsHeading: "What Students Say",
  popularBadge: "Most Popular",
}

export const NEXTQ_PRODUCTS: NextQProduct[] = [
  {
    title: "Personalized Chatbot",
    description:
      "AI-driven chatbot for quizzes and materials tailored specifically to your speed and interests.",
    imageUrl:
    "chatbot.jpg",
  },
  {
    title: "Adaptive Quizzes",
    description:
      "Interactive quizzes that adjust in difficulty based on your performance, ensuring optimal challenge.",
    imageUrl:
      "quiz.jpg",
  },
  {
    title: "Ranked Papers",
    description:
    "Smartly ranked and curated research papers, automatically prioritized by AI for relevance, credibility, and impact.",
    imageUrl:
      "paper.png",
  },
]

export const NEXTQ_ABOUT = {
  heading: "What is NextQ?",
  description:
    "NextQ is an AI-powered learning platform designed to revolutionize the way you learn. By analyzing your learning style, preferences, and progress, NextQ creates a personalized learning path that adapts to your needs. Our platform offers a wide range of courses, interactive quizzes, and progress tracking tools to help you achieve your educational goals efficiently and effectively.",
}

export const NEXTQ_FEATURES: NextQFeature[] = [
  {
    title: "Personalized Chatbot",
    description:
      "AI-driven chatbot for quizzes and materials tailored specifically to your speed and interests.",
    icon: "analytics",
  },
  {
    title: "Adaptive Quizzes",
    description:
      "Challenge yourself with dynamic assessments that grow with you as your skills improve.",
    icon: "adaptive",
  },
  {
    title: "Progress Tracking",
    description:
      "Visualize your growth with elegant dashboards and predictive analytics for future learning.",
    icon: "community",
  },
]

export const NEXTQ_PRICING_PLANS: NextQPricingPlan[] = [
  {
    name: "Basic",
    price: "Free",
    period: "/forever",
    ctaLabel: "Get Started",
    features: [
      "Access to basic courses",
      "Limited adaptive quizzes",
      "Standard analytics",
    ],
  },
  {
    name: "Premium",
    price: "500 PKR",
    period: "/month",
    ctaLabel: "Upgrade Now",
    features: [
      "Unlimited course access",
      "All adaptive features",
      "Advanced progress insights",
      "Priority 24/7 support",
    ],
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    ctaLabel: "Contact Sales",
    features: [
      "Customized organizational plans",
      "Dedicated account manager",
      "API & LMS Integration",
    ],
  },
]

export const NEXTQ_TESTIMONIALS: NextQTestimonial[] = [
  {
    name: "Sophia Carter",
    role: "Medical Student",
    quote:
      "NextQ has completely transformed my learning experience. The personalized learning paths are incredibly effective.",
    rating: 5,
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5MftNQQ9tzC44b8nPybPUBI7zRssDFFRipJdtYnTSYEB0-J46jFT8s-PzeHcgSpzuoLRQXzBy8szdOl3bw9GR_0pC8eYFiSG22YAB8ZMeJNFWGPU7wUGJQvA9Z2fwsbYgaCAp39zsG3zFtATafJmskDYSjmMr8f9IM9xcLeBqIyzt4apFgzjFtIOl3curZz3bcjinNf98NOjA0EpFOEOswDKDXz_s9GnVsP9MJQ3lQKI9qJ21r4zj7CHjVcknYk2HxttLaQgMxYw",
  },
  {
    name: "Ethan Bennett",
    role: "Software Engineering",
    quote:
      "I appreciate the adaptive quizzes that challenge me appropriately. The platform is user-friendly and makes learning enjoyable.",
    rating: 4.5,
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjaYVihI2sKc1lcdDWBQOnPnlDHYCAdNt4GePlYk226k9Bk0Jc18dVecrgOjSiK663ulaJyhCiKLOE10jcb0JLH3X-moUyoCdfnbk-mknH6aD_h6JQJLxZZ5M-GULRDrrb1mWwx139YF1rSZCX0oLR9iMJ7_Yfv9qJ58ncWISFcwR_BORxA5udHwXDX0gdCXX9tYJyuR8Qu6utP7VfhYIZmUGRFk7-35RFq5Gb_y-V2UF6MPP6CFxNHXisw-tNX7KgeqgH9lGSjfg",
  },
  {
    name: "Olivia Hayes",
    role: "High School Teacher",
    quote:
      "The progress tracking feature is fantastic. It helps me stay motivated and focused on my goals. NextQ is a game-changer.",
    rating: 5,
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1YVJqoIeHx-4nEUcrvRKe_PEUPi_zZ07KBQRvLvbTE5T_-1MP3KDWnEtLWTx4yDu5x5D8rw0CCdHii30ALop4-ZeSysp9InN98-1tg00BYMNk2kkYP9384rTW1YynUhNuHRFp8ei74UeaMqss_syFNwafg0DlN8q_qDYDlxK5vpdVqjlIH8MxVVfj8z0JDVrbnhAcEdbUlg7TOrTEua1JXn_V_63IVrve7EzTD_Zkjy8E2WU_QpKwLzAxW2FLX3ImBJaYH8N3-VU",
  },
]

export const NEXTQ_CONTACT = {
  heading: "Start Your Journey Today",
  description:
    "Join thousands of students who have already accelerated their learning with NextQ AI.",
  inputPlaceholder: "Enter your email address",
  ctaLabel: "Subscribe",
  helperText: "By subscribing, you agree to our Terms of Service and Privacy Policy.",
}

export const NEXTQ_FOOTER_LINKS = [
  { label: "About Us", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
]

export const NEXTQ_SOCIAL_LINKS = [
  { label: "Twitter", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
]

export const NEXTQ_COPYRIGHT = "(c) 2024 NextQ. All rights reserved."

