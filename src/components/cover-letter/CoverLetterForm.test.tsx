import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CoverLetterForm } from './CoverLetterForm';
import { useResumeStore } from '@/store/resumeStore';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the resume store
vi.mock('@/store/resumeStore', () => ({
  useResumeStore: vi.fn(),
}));

describe('CoverLetterForm', () => {
  const mockResume = {
    id: '123',
    contactInfo: {
      fullName: 'John Doe',
    },
  };

  beforeEach(() => {
    vi.mocked(useResumeStore).mockReturnValue({
      resume: mockResume,
    });
  });

  it('renders all form fields', () => {
    render(<CoverLetterForm />);
    
    expect(screen.getByTestId('recipient-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('recipient-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('company-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('company-address-input')).toBeInTheDocument();
    expect(screen.getByTestId('job-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('resume-select')).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<CoverLetterForm />);
    
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Recipient name must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Recipient title must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Company name must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Company address must be at least 5 characters')).toBeInTheDocument();
      expect(screen.getByText('Job title must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    render(<CoverLetterForm />);
    
    fireEvent.change(screen.getByTestId('recipient-name-input'), {
      target: { value: 'Jane Smith' },
    });
    fireEvent.change(screen.getByTestId('recipient-title-input'), {
      target: { value: 'Hiring Manager' },
    });
    fireEvent.change(screen.getByTestId('company-name-input'), {
      target: { value: 'Acme Corp' },
    });
    fireEvent.change(screen.getByTestId('company-address-input'), {
      target: { value: '123 Business St, City, State 12345' },
    });
    fireEvent.change(screen.getByTestId('job-title-input'), {
      target: { value: 'Senior Software Engineer' },
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Cover letter form data:',
        expect.objectContaining({
          recipientName: 'Jane Smith',
          recipientTitle: 'Hiring Manager',
          companyName: 'Acme Corp',
          companyAddress: '123 Business St, City, State 12345',
          jobTitle: 'Senior Software Engineer',
          resumeId: '123',
        })
      );
    });
  });

  it('displays available resume in the select dropdown', () => {
    render(<CoverLetterForm />);
    
    expect(screen.getByText("John Doe's Resume")).toBeInTheDocument();
  });

  it('shows no resumes available when resume store is empty', () => {
    vi.mocked(useResumeStore).mockReturnValue({
      resume: null,
    });

    render(<CoverLetterForm />);
    
    expect(screen.getByText('No resumes available')).toBeInTheDocument();
  });
});