import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CoverLetterPreview } from './CoverLetterPreview';
import { useResumeStore } from '@/store/resumeStore';
import type { Resume } from '@/types/resume.types';

// Mock the resume store
vi.mock('@/store/resumeStore', () => ({
  useResumeStore: vi.fn(),
}));

describe('CoverLetterPreview', () => {
  const mockResume: Resume = {
    id: '1',
    contactInfo: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      location: 'New York, USA',
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
    education: [],
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

  const mockCoverLetter = {
    recipientName: 'Jane Smith',
    recipientTitle: 'Hiring Manager',
    companyName: 'Acme Corp',
    companyAddress: '123 Business St, City, State 12345',
    jobTitle: 'Senior Software Engineer',
    resumeId: '1',
  };

  beforeEach(() => {
    vi.mocked(useResumeStore).mockReturnValue({
      resume: mockResume,
    });
  });

  it('renders empty state when no resume is available', () => {
    vi.mocked(useResumeStore).mockReturnValue({
      resume: null,
    });

    render(<CoverLetterPreview coverLetter={mockCoverLetter} />);
    expect(screen.getByText('No resume data available')).toBeInTheDocument();
  });

  it('renders all sections of the cover letter', () => {
    render(<CoverLetterPreview coverLetter={mockCoverLetter} />);

    // Sender's Information
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('New York, USA')).toBeInTheDocument();

    // Recipient's Information
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Hiring Manager')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('123 Business St, City, State 12345')).toBeInTheDocument();

    // Content
    expect(screen.getByText(/I am writing to express my strong interest/)).toBeInTheDocument();
    expect(screen.getByText(/Thank you for considering my application/)).toBeInTheDocument();
  });

  it('includes job-specific information in the content', () => {
    render(<CoverLetterPreview coverLetter={mockCoverLetter} />);

    expect(screen.getByText(/Senior Software Engineer position/)).toBeInTheDocument();
    expect(screen.getByText(/Acme Corp/)).toBeInTheDocument();
  });

  it('includes skills from the resume', () => {
    render(<CoverLetterPreview coverLetter={mockCoverLetter} />);

    expect(screen.getByText(/JavaScript, React/)).toBeInTheDocument();
  });
});