import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactInfo } from './ContactInfo';
import { useResumeStore } from '@/store/resumeStore';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('ContactInfo', () => {
  it('renders all form fields', () => {
    render(<ContactInfo />);
    
    expect(screen.getByTestId('fullName-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('phone-input')).toBeInTheDocument();
    expect(screen.getByTestId('location-input')).toBeInTheDocument();
    expect(screen.getByTestId('website-input')).toBeInTheDocument();
    expect(screen.getByTestId('linkedin-input')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ContactInfo />);
    
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Full name must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Phone number must be at least 10 characters')).toBeInTheDocument();
      expect(screen.getByText('Location must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<ContactInfo />);
    
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'invalid-email' },
    });
    
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('validates LinkedIn URL format', async () => {
    render(<ContactInfo />);
    
    fireEvent.change(screen.getByTestId('linkedin-input'), {
      target: { value: 'https://invalid-url.com' },
    });
    
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Must be a valid LinkedIn URL')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockUpdateContactInfo = vi.fn();
    vi.spyOn(useResumeStore, 'getState').mockImplementation(() => ({
      resume: null,
      updateContactInfo: mockUpdateContactInfo,
    }));

    render(<ContactInfo />);
    
    fireEvent.change(screen.getByTestId('fullName-input'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByTestId('phone-input'), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByTestId('location-input'), {
      target: { value: 'New York, USA' },
    });
    fireEvent.change(screen.getByTestId('linkedin-input'), {
      target: { value: 'https://linkedin.com/in/johndoe' },
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockUpdateContactInfo).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        location: 'New York, USA',
        linkedin: 'https://linkedin.com/in/johndoe',
        website: '',
      });
    });
  });
});