import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkExperience } from './WorkExperience';
import { useResumeStore } from '@/store/resumeStore';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('WorkExperience', () => {
  const mockStore = {
    resume: {
      workExperience: [],
    },
    addWorkExperience: vi.fn(),
    updateWorkExperience: vi.fn(),
    removeWorkExperience: vi.fn(),
  };

  beforeEach(() => {
    vi.spyOn(useResumeStore, 'getState').mockImplementation(() => mockStore);
  });

  it('renders the work experience form with initial empty experience', () => {
    render(<WorkExperience />);
    
    expect(screen.getByTestId('experience-0')).toBeInTheDocument();
    expect(screen.getByTestId('company-input-0')).toBeInTheDocument();
    expect(screen.getByTestId('position-input-0')).toBeInTheDocument();
    expect(screen.getByTestId('location-input-0')).toBeInTheDocument();
    expect(screen.getByTestId('start-date-input-0')).toBeInTheDocument();
    expect(screen.getByTestId('end-date-input-0')).toBeInTheDocument();
    expect(screen.getByTestId('description-input-0')).toBeInTheDocument();
  });

  it('allows adding new experience entries', () => {
    render(<WorkExperience />);
    
    fireEvent.click(screen.getByTestId('add-experience'));
    
    expect(screen.getByTestId('experience-1')).toBeInTheDocument();
  });

  it('allows removing experience entries', () => {
    render(<WorkExperience />);
    
    // Add a new experience first
    fireEvent.click(screen.getByTestId('add-experience'));
    expect(screen.getByTestId('experience-1')).toBeInTheDocument();
    
    // Remove the second experience
    fireEvent.click(screen.getByTestId('remove-experience-1'));
    expect(screen.queryByTestId('experience-1')).not.toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<WorkExperience />);
    
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Company name must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Position must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Location must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Start date is required')).toBeInTheDocument();
      expect(screen.getByText('End date is required')).toBeInTheDocument();
      expect(screen.getByText('Description cannot be empty')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<WorkExperience />);
    
    // Fill out the form
    fireEvent.change(screen.getByTestId('company-input-0'), {
      target: { value: 'Example Company' },
    });
    fireEvent.change(screen.getByTestId('position-input-0'), {
      target: { value: 'Software Engineer' },
    });
    fireEvent.change(screen.getByTestId('location-input-0'), {
      target: { value: 'New York, USA' },
    });
    fireEvent.change(screen.getByTestId('start-date-input-0'), {
      target: { value: '2022-01' },
    });
    fireEvent.change(screen.getByTestId('end-date-input-0'), {
      target: { value: '2023-01' },
    });
    fireEvent.change(screen.getByTestId('description-input-0'), {
      target: { value: 'Led development of key features' },
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockStore.addWorkExperience).toHaveBeenCalledWith({
        company: 'Example Company',
        position: 'Software Engineer',
        location: 'New York, USA',
        startDate: '2022-01',
        endDate: '2023-01',
        current: false,
        description: ['Led development of key features'],
      });
    });
  });
});