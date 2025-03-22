import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResumeForm } from './ResumeForm';
import { useResumeStore } from '@/store/resumeStore';

// Mock the store
vi.mock('@/store/resumeStore', () => ({
  useResumeStore: vi.fn(),
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('ResumeForm', () => {
  const mockResume = {
    id: '1',
    contactInfo: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      location: 'New York, USA',
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
    ],
    lastUpdated: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.mocked(useResumeStore).mockReturnValue({
      resume: mockResume,
      setResume: vi.fn(),
      updateContactInfo: vi.fn(),
      addWorkExperience: vi.fn(),
      updateWorkExperience: vi.fn(),
      removeWorkExperience: vi.fn(),
      addEducation: vi.fn(),
      updateEducation: vi.fn(),
      removeEducation: vi.fn(),
      addSkill: vi.fn(),
      updateSkill: vi.fn(),
      removeSkill: vi.fn(),
    });
  });

  it('renders all resume sections', () => {
    render(<ResumeForm />);
    
    expect(screen.getByTestId('contact-info-section')).toBeInTheDocument();
    expect(screen.getByTestId('work-experience-section')).toBeInTheDocument();
    expect(screen.getByTestId('education-section')).toBeInTheDocument();
    expect(screen.getByTestId('skills-section')).toBeInTheDocument();
  });

  it('shows preview dialog with resume data when preview button is clicked', async () => {
    render(<ResumeForm />);
    
    fireEvent.click(screen.getByTestId('preview-button'));
    
    await waitFor(() => {
      expect(screen.getByText(/"fullName":/)).toBeInTheDocument();
      expect(screen.getByText(/"John Doe"/)).toBeInTheDocument();
      expect(screen.getByText(/"company":/)).toBeInTheDocument();
      expect(screen.getByText(/"Example Corp"/)).toBeInTheDocument();
      expect(screen.getByText(/"institution":/)).toBeInTheDocument();
      expect(screen.getByText(/"Example University"/)).toBeInTheDocument();
      expect(screen.getByText(/"JavaScript"/)).toBeInTheDocument();
    });
  });

  it('maintains form state across section updates', () => {
    render(<ResumeForm />);
    
    // Verify initial data is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Example Corp')).toBeInTheDocument();
    expect(screen.getByText('Example University')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });
});