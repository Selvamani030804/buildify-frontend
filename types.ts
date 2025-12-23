
export interface BusinessData {
  idea: string;
  name: string;
  tagline: string;
  industry: string;
  targetAudience: string;
  description: string;
  logo?: string;
  video?: string;
  uiDesign?: {
    colors: Array<{ name: string; hex: string }>;
    fonts: { heading: string; body: string };
    layout: string;
    heroCopy: string;
  };
}

export interface Project {
  id: string;
  name: string;
  lastModified: number;
  data: BusinessData;
}

export interface User {
  name: string;
  email: string;
  plan: string;
}

export enum AppRoute {
  HOME = 'home',
  PROJECTS = 'projects',
  OVERVIEW = 'overview',
  IDEA = 'idea',
  IDENTITY = 'identity',
  STUDIO = 'studio',
  UI_SUGGESTION = 'ui_suggestion',
  CHAT = 'chat',
  CONSULTANT = 'consultant',
  SUBSCRIPTION = 'subscription',
  SETTINGS = 'settings',
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string;
  video?: string;
  sources?: Array<{ title: string; uri: string }>;
}

export interface AIStudioWindow {
  aistudio?: {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  };
}