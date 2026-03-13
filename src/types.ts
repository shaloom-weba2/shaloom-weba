export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  avatar: string;
  hackerImage: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram?: string;
    tiktok?: string;
    whatsapp?: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: "Frontend" | "Backend" | "Security" | "Other";
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  link: string;
  github: string;
}

export interface Research {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  published: boolean;
  showInMenu: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  showHero: boolean;
  showAbout: boolean;
  showSkills: boolean;
  showProjects: boolean;
  showResearch: boolean;
  showBlog: boolean;
  showContact: boolean;
}

export interface Platform {
  name: string;
  logoText1: string;
  logoText2: string;
  logoIcon: string;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  research: Research[];
  blog: BlogPost[];
  messages: Message[];
  pages: DynamicPage[];
  settings: Settings;
  platform: Platform;
  admin: {
    passwordHash: string;
  };
}
