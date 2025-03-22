import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ATSChecker } from './ATSChecker';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('ATSChecker', () => {
  it('renders the file upload area', () => {
    render(<ATSChecker />);
    
    expect(screen.getByText(/Drag and drop your resume here/)).toBeInTheDocument();
    expect(screen.getByText(/Supported formats: PDF, DOCX/)).toBeInTheDocument();
  });

  it('shows error toast for invalid file type', async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const { container } = render(<ATSChecker />);
    
    const input = container.querySelector('input[type="file"]');
    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
    }

    await waitFor(() => {
      expect(screen.getByText('Invalid file type')).toBeInTheDocument();
    });
  });

  it('shows analysis results after file upload', async () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const { container } = render(<ATSChecker />);
    
    const input = container.querySelector('input[type="file"]');
    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
    }

    await waitFor(() => {
      expect(screen.getByText('ATS Compatibility Score')).toBeInTheDocument();
      expect(screen.getByText('Analysis Results')).toBeInTheDocument();
      expect(screen.getByText('Suggestions for Improvement')).toBeInTheDocument();
    });
  });

  it('allows re-analysis of uploaded file', async () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const { container } = render(<ATSChecker />);
    
    const input = container.querySelector('input[type="file"]');
    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
    }

    await waitFor(() => {
      const reAnalyzeButton = screen.getByText('Re-analyze');
      expect(reAnalyzeButton).toBeInTheDocument();
      fireEvent.click(reAnalyzeButton);
      expect(screen.getByText('Analyzing...')).toBeInTheDocument();
    });
  });
});