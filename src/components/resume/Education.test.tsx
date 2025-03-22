import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Education } from './Education';
import { useResumeStore } from '@/store/resumeStore';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('Education', () => {
  const mockStore = {
    resume: {
      education: [],
    },
    addEducation: vi.fn(),
    updateEducation: vi.fn(),
    removeEducation: vi.fn(),
  };

  beforeEach(() => {
    vi.spyOn(useResumeStore, 'getState').mockImplementation(() => mockStore);
  });

  it('renders the education form with initial empty education', () => {
    render(<Education />);
    
    expect(screen.getByTestId('education-0')).toBeInTheDocument();
    expect(screen.getByTestId('institution-input-0')).toBeInTheDocument();
    expect(screen.getByTestId('degree-input-0')).toBeInTheDocument();
    expect(screen.getByTestId('field-input-0')).toBeInTheDocument();
    expect(screen.getByTestId('location-input-0')).toBeInTheDocument();
    expect(screen.getByTestId('start-date-input-0')).toBeInTheDocument();
    expect(screen.getByTestId('end-date-input-0')).toBeInTheDocument();
    expect(screen.getByTestId('gpa-input-0')).toBeInTheDocument();
  });

  it('allows adding new education entries', () => {
    render(<Education />);
    
    fireEvent.click(screen.getByTestId('add-education'));
    
    expect(screen.getByTestId('education-1')).toBeInTheDocument();
  });

  it('allows removing education entries', () => {
    render(<Education />);
    
    // Add a new education first
    fireEvent.click(screen.getByTestId('add-education'));
    expect(screen.getByTestId('education-1')).toBeInTheDocument();
    
    // Remove the second education
    fireEvent.click(screen.getByTestId('remove-education-1'));
    expect(screen.queryByTestId('education-1')).not.toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<Education />);
    
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Institution name must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Degree must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Field of study must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Location must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Start date is required')).toBeInTheDocument();
      expect(screen.getByText('End date is required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<Education />);
    
    // Fill out the form
    fireEvent.change(screen.getByTestId('institution-input-0'), {
      target: { value: 'Example University' },
    });
    fireEvent.change(screen.getByTestId('degree-input-0'), {
      target: { value: "Bachelor's" },
    });
    fireEvent.change(screen.getByTestId('field-input-0'), {
      target: { value: 'Computer Science' },
    });
    fireEvent.change(screen.getByTestId('location-input-0'), {
      target: { value: 'New York, USA' },
    });
    fireEvent.change(screen.getByTestId('start-date-input-0'), {
      target: { value: '2018-09' },
    });
    fireEvent.change(screen.getByTestId('end-date-input-0'), {
      target: { value: '2022-05' },
    });
    fireEvent.change(screen.getByTestId('gpa-input-0'), {
      target: { value: '3.8' },
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockStore.addEducation).toHaveBeenCalledWith({
        institution: 'Example University',
        degree: "Bachelor's",
        field: 'Computer Science',
        location: 'New York, USA',
        startDate: '2018-09',
        endDate: '2022-05',
        gpa: 3.8,
      });
    });
  });

  it('handles optional GPA field correctly', async () => {
    render(<Education />);
    
    // Fill out required fields
    fireEvent.change(screen.getByTestId('institution-input-0'), {
      target: { value: 'Example University' },
    });
    fireEvent.change(screen.getByTestId('degree-input-0'), {
      target: { value: "Bachelor's" },
    });
    fireEvent.change(screen.getByTestId('field-input-0'), {
      target: { value: 'Computer Science' },
    });
    fireEvent.change(screen.getByTestId('location-input-0'), {
      target: { value: 'New York, USA' },
    });
    fireEvent.change(screen.getByTestId('start-date-input-0'), {
      target: { value: '2018-09' },
    });
    fireEvent.change(screen.getByTestId('end-date-input-0'), {
      target: { value: '2022-05' },
    });

    // Submit without GPA
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockStore.addEducation).toHaveBeenCalledWith({
        institution: 'Example University',
        degree: "Bachelor's",
        field: 'Computer Science',
        location: 'New York, USA',
        startDate: '2018-09',
        endDate: '2022-05',
        gpa: undefined,
      });
    });
  });
});