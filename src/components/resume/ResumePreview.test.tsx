import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResumePreview } from './ResumePreview';
import type { Resume } from '@/types/resume.types';

describe('ResumePreview', () => {
  const mockResume: Resume = {
    id: '1',
    contactInfo: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      location: 'New York, USA',
      website: 'https://johndoe.com',
      linkedin: 'https://linkedin.com/in/johndoe',
    },
    workExperience: [
      {
        id: '1',
        company: 'Example Corp',
        position: 'Software Engineer',
        location: 'New York, USA',
        startDate: '2020-01',
        endDate: '2023-01',
        current: false,
        description: ['Led development of key features'],
      },
    ],
    education: [
      {
        id: '1',
        institution: 'Example University',
        degree: "Bachelor's",
        field: 'Computer Science',
        startDate: '2016-09',
        endDate: '2020-05',
        location: 'New York, USA',
        gpa: 3.8,
      },
    ],
    skills: [
      {
        id: '1',
        name: 'JavaScript',
        level: 'Advanced',
        category: 'Programming Languages',
      },
      {
        id: '2',
        name: 'React',
        level: 'Expert',
        category: 'Frameworks & Libraries',
      },
    ],
    lastUpdated: new Date().toISOString(),
  };

  it('renders empty state when no resume is provided', () => {
    render(<ResumePreview resume={null} />);
    expect(screen.getByText('No resume data available')).toBeInTheDocument();
  });

  it('renders all sections of the resume', () => {
    render(<ResumePreview resume={mockResume} />);

    // Contact Info
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('New York, USA')).toBeInTheDocument();

    // Work Experience
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Example Corp')).toBeInTheDocument();
    expect(screen.getByText('Led development of key features')).toBeInTheDocument();

    // Education
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Example University')).toBeInTheDocument();
    expect(screen.getByText("Bachelor's in Computer Science")).toBeInTheDocument();
    expect(screen.getByText('GPA: 3.80')).toBeInTheDocument();

    // Skills
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Programming Languages')).toBeInTheDocument();
    expect(screen.getByText('Frameworks & Libraries')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<ResumePreview resume={mockResume} />);
    expect(screen.getByText('Jan 2020 - Jan 2023')).toBeInTheDocument();
    expect(screen.getByText('Sep 2016 - May 2020')).toBeInTheDocument();
  });

  it('handles current work experience', () => {
    const resumeWithCurrentJob = {
      ...mockResume,
      workExperience: [{
        ...mockResume.workExperience[0],
        current: true,
      }],
    };
    render(<ResumePreview resume={resumeWithCurrentJob} />);
    expect(screen.getByText('Jan 2020 - Present')).toBeInTheDocument();
  });
});