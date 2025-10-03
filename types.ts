import React from 'react';

// For App-level types
export type Page = 'home' | 'mind' | 'work' | 'pricing' | 'connect' | 'clienthub' | 'article';
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ar';

// For Quote Calculator
export interface FormData {
  clientName: string;
  projectTitle: string;
  projectType: string;
  videoLength: string;
  shootingDays: string;
  services: string[];
  additionalDetails: string;
}

export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface Quote {
  quoteNumber: string;
  date: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  projectName: string;
  lineItems: LineItem[];
  subtotal: number;
  grandTotal: number;
  notes: string;
}

export type ServiceName = 'Photography' | 'Video Production' | 'Post Production' | '360 Tours' | 'Time Lapse' | 'Photogrammetry';

export interface QuoteFormData {
  engagementType: 'Project' | 'Retainer' | 'Training' | null;
  service: ServiceName | null;
  config: {
    // Project-based configs
    subService?: string;
    logistics?: string;
    delivery?: string;
    addons?: string[];
    [key: string]: any; // For other dynamic properties

    // Retainer-based configs
    hours?: number;
    retainerAddons?: string[];
  };
  contact: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
}


// For Partner Hub
export interface User {
  name: string;
  company: string;
  email: string;
  phone: string;
}

export interface Project {
  id: number;
  client_id: string; // Corresponds to the user's auth.uid()
  status: 'Pending Approval' | 'In Progress' | 'Awaiting Feedback' | 'Completed';
  project_type: string;
  sub_service: string;
  style: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  requirements: string;
  media_url?: string; // URL to the review media
  media_type?: 'image' | 'video'; // Type of the review media
  timeline?: {
    startDate: string;
    estimatedCompletion: string;
    milestones: {
      name: string;
      date: string;
      status: 'completed' | 'upcoming';
    }[];
  };
}

export interface FeedbackComment {
  id?: number;
  project_id: number;
  user_id: string;
  version: number;
  comment_text: string;
  type: 'video' | 'image';
  timestamp?: number;   // For video comments
  position_x?: number;  // For image comments
  position_y?: number;  // For image comments
  created_at?: string;
}

// For Mind Page
export interface ArticleSection {
  heading?: string;
  image?: string;
  paragraphs: string[];
}

export interface Article {
  id: number;
  image: string;
  category: string;
  title: string;
  excerpt: string;
  content?: ArticleSection[];
}