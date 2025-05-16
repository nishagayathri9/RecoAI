export interface NavItem {
  name: string;
  path: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface HowItWorksStep {
  id: string;
  title: string;
  description: string;
  image?: string;
}

export interface DataPoint {
  id: number;
  position: [number, number, number];
  color: string;
  label: string;
  category: string;
  details?: Record<string, any>;
}

export interface DatasetFile {
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
}

export interface TestimonialType {
  id: number;
  name: string;
  role: string;
  company: string;
  text: string;
  image: string;
}

export interface FaqItemType {
  question: string;
  answer: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}