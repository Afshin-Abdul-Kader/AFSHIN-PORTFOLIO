export const profile = {
  name: "Afshin Abdul Kader",
  role: "AI & ML Engineering Student · Software Developer · Builder",
  location: "Chennai, India",
  education: "B.E. Computer Science & Engineering — Artificial Intelligence & Machine Learning",
  college: "SRM Easwari Engineering College",
  email: "afshinabdulkader@gmail.com",
  phone: "9488158430",
  github: "https://github.com/Afshin-Abdul-Kader",
  linkedin: "https://www.linkedin.com/in/afshin-abdul-kader-0b4014375/",
  leetcode: "https://leetcode.com/u/Afshin_abdul_kader/",
  instagram: "https://www.instagram.com/afshin__.__/?__pwa=1"
};

export const socialLinks = [
  { label: "GitHub", value: "Projects & source", url: profile.github, icon: "GH" },
  { label: "LinkedIn", value: "Professional profile", url: profile.linkedin, icon: "in" },
  { label: "LeetCode", value: "DSA & problem solving", url: profile.leetcode, icon: "LC" },
  { label: "Instagram", value: "Personal profile", url: profile.instagram, icon: "IG" }
];

export const projects = [
  {
    id: "smart-ledger",
    eyebrow: "DESKTOP APPLICATION · BUSINESS SOFTWARE",
    title: "Smart Ledger",
    status: "Desktop App",
    description: "A business financial management application evolved from a localStorage prototype into a SQLite-backed Node/Express system and packaged Windows desktop software.",
    details: "Cash Counter, bank balance, portal and party workflows, transaction clearing, created/cleared dates, SQLite persistence and Electron packaging.",
    stack: ["Node.js", "Express", "SQLite", "Electron"],
    actionLabel: "Download App",
    actionUrl: "",
    secondaryLabel: "GitHub",
    secondaryUrl: ""
  },
  {
    id: "roadguard-ai",
    eyebrow: "AI · COMPUTER VISION · GIS",
    title: "RoadGuard AI",
    status: "Under Development",
    description: "An AI-powered road maintenance coordination platform connecting detection, prioritization, assignment, repair and verification.",
    details: "RDD2022 India data preparation and a YOLO baseline are completed. The wider coordination platform is actively under development.",
    stack: ["Python", "FastAPI", "YOLO", "PyTorch", "OpenCV"],
    actionLabel: "View Project",
    actionUrl: "",
    secondaryLabel: "GitHub",
    secondaryUrl: ""
  },
  {
    id: "mini-games",
    eyebrow: "WEB · JAVASCRIPT · INTERACTIVE",
    title: "Mini Games Hub",
    status: "Live",
    description: "A browser-based collection of game experiments including Hand Cricket, Thirudan Police and Pen Fight.",
    details: "Built to explore interaction, multiplayer concepts and browser-side game mechanics.",
    stack: ["JavaScript", "Firebase", "Matter.js"],
    actionLabel: "Play Now",
    actionUrl: "",
    secondaryLabel: "GitHub",
    secondaryUrl: ""
  }
];

export const skills = [
  ["Languages", "Java · Python · JavaScript · C"],
  ["Frontend", "React · HTML · CSS · Responsive UI"],
  ["Backend", "Node.js · Express · REST APIs"],
  ["Data", "SQL · SQLite · PostgreSQL"],
  ["AI / ML", "PyTorch · YOLO · OpenCV"],
  ["Tools", "Git · GitHub · Firebase · Vercel · Electron"]
];

export const certifications = [
  { title: "SQL and Relational Databases 101", issuer: "IBM Skills Network / Cognitive Class", issued: "August 26, 2026" },
  { title: "Introduction to Generative AI", issuer: "AWS Educate", issued: "September 2, 2026" }
];

export const problemSolving = { accepted: 70, streak: 70, studyDays: 71 };
