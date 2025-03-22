/**
 * Core resume data types for the Resume Builder application
 */

export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa?: number;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface Resume {
  id: string;
  contactInfo: ContactInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  lastUpdated: string;
}

export interface CoverLetter {
  id: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  jobTitle: string;
  resumeId: string;
  content: string;
  lastUpdated: string;
}