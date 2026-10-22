export const portfolioProfile = {
  name: "Ganesh Shinde",
  role: "Full Stack Engineer",
  location: "Mumbai, India",
  experience: "2+ years of experience",
  introduction:
    "I build web applications with React, TypeScript, Node.js, and relational databases. My experience includes developing reusable interfaces, integrating REST APIs, and working across frontend and backend workflows.",
  about:
    "I have worked on healthcare applications, government-scale project modules, partner-profile workflows, and a corporate website. I also develop Innocent Writer, a full-stack poetry publishing application, to work with authentication, role-based access control, API design, and structured data management.",
  email: "ganishinde907@gmail.com",
  phone: "+91-9653426260",
  linkedin: "https://linkedin.com/in/ganesh-shinde0907",
  github: "https://github.com/Ganesh907",
  // resumePath: "/resume/Ganesh_Shinde_Resume.pdf",
  availabilityNote: "For professional enquiries, please get in touch by email.",
} as const;

export type SkillCategory =
  "All" | "Frontend" | "Backend" | "Database" | "Tools" | "Architecture";

export const skillCategories: SkillCategory[] = [
  "All",
  "Frontend",
  "Backend",
  "Database",
  "Tools",
  "Architecture",
];

export interface PortfolioSkill {
  name: string;
  category: Exclude<SkillCategory, "All">;
  evidence: "Resume" | "Innocent Writer";
}

export const portfolioSkills: PortfolioSkill[] = [
  // Skills documented in the supplied resume.
  { name: "React.js", category: "Frontend", evidence: "Resume" },
  { name: "JavaScript (ES6)", category: "Frontend", evidence: "Resume" },
  { name: "TypeScript", category: "Frontend", evidence: "Resume" },
  { name: "HTML5", category: "Frontend", evidence: "Resume" },
  { name: "CSS3", category: "Frontend", evidence: "Resume" },
  { name: "Tailwind CSS", category: "Frontend", evidence: "Resume" },
  { name: "React Router", category: "Frontend", evidence: "Resume" },
  { name: "Material UI", category: "Frontend", evidence: "Resume" },

  { name: "Node.js", category: "Backend", evidence: "Resume" },
  { name: "Express.js", category: "Backend", evidence: "Resume" },
  { name: "ASP.NET Web API", category: "Backend", evidence: "Resume" },

  { name: "PostgreSQL", category: "Database", evidence: "Resume" },
  { name: "MS SQL Server", category: "Database", evidence: "Resume" },

  { name: "Git", category: "Tools", evidence: "Resume" },
  { name: "GitHub", category: "Tools", evidence: "Resume" },
  { name: "Postman", category: "Tools", evidence: "Resume" },
  { name: "VS Code", category: "Tools", evidence: "Resume" },
  { name: "Visual Studio", category: "Tools", evidence: "Resume" },

  // Technologies and patterns represented in this project's source
  // and architecture. These are not independent skill ratings.
  { name: "Axios", category: "Frontend", evidence: "Innocent Writer" },
  {
    name: "TanStack Query",
    category: "Frontend",
    evidence: "Innocent Writer",
  },
  {
    name: "shadcn/ui",
    category: "Frontend",
    evidence: "Innocent Writer",
  },
  {
    name: "Prisma ORM",
    category: "Backend",
    evidence: "Innocent Writer",
  },
  {
    name: "JWT Authentication",
    category: "Architecture",
    evidence: "Innocent Writer",
  },
  {
    name: "Role-Based Access Control",
    category: "Architecture",
    evidence: "Innocent Writer",
  },
  {
    name: "Layered Backend Architecture",
    category: "Architecture",
    evidence: "Innocent Writer",
  },
  {
    name: "Feature-Based Frontend Architecture",
    category: "Architecture",
    evidence: "Innocent Writer",
  },
];

export interface PortfolioProject {
  name: string;
  category: string;
  description: string;
  technologies: string[];
  highlights: string[];
  links: {
    label: string;
    url: string;
  }[];
}

export const portfolioProjects: PortfolioProject[] = [
  {
    name: "Innocent Writer",
    category: "Full-stack personal project",
    description:
      "A poetry publishing application built with a React and TypeScript frontend and a Node.js and Express backend. The project brings public poem browsing, user interactions, authentication, and administration into one application.",
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Prisma",
    ],
    highlights: [
      "Public poem listing with search and pagination",
      "Poem details, likes, comments, and image handling",
      "JWT authentication and role-based authorization",
      "Administrative dashboard, user management, and poem moderation",
      "Layered backend architecture and lifetime-unique poem view tracking",
    ],
    links: [
      {
        label: "Backend repository",
        url: "https://github.com/Ganesh907/innocent-writer-backend",
      },
    ],
  },
  {
    name: "Healthcare Web Application",
    category: "Professional project",
    description:
      "Worked on a healthcare application covering Clinic, Doctor, Lab, and Pharmacy modules, building React interfaces and supporting API-integrated workflows.",
    technologies: [
      "React.js",
      "TypeScript",
      "REST APIs",
      "Node.js",
      "Express.js",
      "PostgreSQL",
    ],
    highlights: [
      "Developed UI screens and reusable React components",
      "Integrated REST APIs and frontend-backend data flows",
      "Contributed to backend API creation and modifications",
    ],
    links: [],
  },
  {
    name: "Hamara Kendra",
    category: "Professional project",
    description:
      "Worked on modules for a PAN-India government-scale project, including partner-profile and enquiry-management workflows.",
    technologies: ["React.js", "ASP.NET Web API", "SQL Server"],
    highlights: [
      "Built React UI modules and integrated existing APIs",
      "Worked with SQL Server stored-procedure workflows",
      "Created and modified APIs where required",
      "Worked on dynamic partner-profile form configuration",
    ],
    links: [],
  },
  {
    name: "BitByBit Solutions Corporate Website",
    category: "Professional project",
    description:
      "Independently designed and developed the company corporate website with reusable React components, routing, and responsive layouts.",
    technologies: [
      "React.js",
      "JavaScript",
      "Tailwind CSS",
      "React Router",
      "EmailJS",
    ],
    highlights: [
      "Built reusable components and branding pages",
      "Implemented responsive layouts and routing",
      "Integrated EmailJS for contact-form email functionality",
    ],
    links: [
      {
        label: "Visit live website",
        url: "https://bitbybitsolutions.co.in",
      },
    ],
  },
];

export const portfolioExperience = [
  {
    role: "Software Engineer",
    company: "BitByBit Solutions",
    period: "Jan 2025 – May 2026",
    description:
      "Worked on healthcare application modules, reusable React interfaces, API integrations, backend changes, and partner-profile workflows.",
  },
  {
    role: "Associate Software Engineer",
    company: "BitByBit Solutions",
    period: "May 2024 – Dec 2024",
    description:
      "Developed React modules for Hamara Kendra, integrated ASP.NET Web APIs, and worked with SQL Server stored procedures and EMS functionality.",
  },
  {
    role: "Software Trainee",
    company: "BitByBit Solutions",
    period: "Jan 2024 – Apr 2024",
    description:
      "Developed React UI components and the company's corporate website, with exposure to routing, responsive layouts, and API integration.",
  },
  {
    role: "Technical Intern",
    company: "BitByBit Solutions",
    period: "Oct 2023 – Dec 2023",
    description:
      "Worked on programming fundamentals, object-oriented concepts, SQL basics, and small UI and data-related tasks.",
  },
] as const;

export const portfolioEducation = [
  {
    qualification: "B.Sc. Information Technology",
    institution: "University of Mumbai",
    period: "Jun 2019 – Dec 2022",
    result: "8.53 CGPA",
  },
  {
    qualification: "PG in Java Development",
    institution: "Itvedant Education Pvt. Ltd.",
    period: "2022 – 2023",
    result: "Course certificate",
  },
] as const;
