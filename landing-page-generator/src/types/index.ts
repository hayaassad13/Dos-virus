export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface LandingPage {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  content: PageContent;
  settings: PageSettings;
  isPublished: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageContent {
  hero: HeroSection;
  features?: FeatureSection[];
  cta: CTASection;
  footer: FooterSection;
  form?: FormSection;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  backgroundColor: string;
  textColor: string;
  buttonText: string;
  buttonColor: string;
}

export interface FeatureSection {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface CTASection {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonColor: string;
  backgroundColor: string;
}

export interface FooterSection {
  text: string;
  links?: FooterLink[];
  backgroundColor: string;
  textColor: string;
}

export interface FooterLink {
  text: string;
  url: string;
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
  submitButtonText: string;
  successMessage: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'phone';
  label: string;
  placeholder: string;
  required: boolean;
}

export interface FormSubmission {
  id: string;
  landingPageId: string;
  data: Record<string, string>;
  submittedAt: Date;
  ipAddress?: string;
}

export interface PageSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  customDomain?: string;
  analyticsId?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'business' | 'personal' | 'event' | 'product';
  defaultContent: PageContent;
  defaultSettings: PageSettings;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface PagesState {
  pages: LandingPage[];
  currentPage: LandingPage | null;
  isLoading: boolean;
  error: string | null;
}

export interface TemplatesState {
  templates: Template[];
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  pages: PagesState;
  templates: TemplatesState;
}