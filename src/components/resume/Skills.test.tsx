import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Skills } from './Skills';
import { useResumeStore } from '@/store/resumeStore';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('Skills', () => {
  const mockStore = {
    resume: {
      skills: [],
    },
    addSkill: vi.fn(),
    updateSkill: vi.fn(),
    removeSkill: vi.fn(),
  };

  beforeEach(() => {
    vi.spyOn(useResumeStore, 'getState').mockImplementation(() => mockStore);
  });

  it('renders the skills form with initial empty skill', () => {
    render(<Skills />);
    
    expect(screen.getByTestId('skill-0')).toBeInTheDocument();
    expect(screen.getByTestId('skill-name-input-0')).toBeInTheDocument();
    expect(screen.getByTestId('skill-level-select-0')).toBeInTheDocument();
    expect(screen.getByTestId('skill-category-select-0')).toBeInTheDocument();
  });

  it('allows adding new skill entries', () => {
    render(<Skills />);
    
    fireEvent.click(screen.getByTestId('add-skill'));
    
    expect(screen.getByTestId('skill-1')).toBeInTheDocument();
  });

  it('allows removing skill entries', () => {
    render(<Skills />);
    
    // Add a new skill first
    fireEvent.click(screen.getByTestId('add-skill'));
    expect(screen.getByTestId('skill-1')).toBeInTheDocument();
    
    // Remove the second skill
    fireEvent.click(screen.getByTestId('remove-skill-1'));
    expect(screen.queryByTestId('skill-1')).not.toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<Skills />);
    
    // Clear the skill name field
    fireEvent.change(screen.getByTestId('skill-name-input-0'), {
      target: { value: '' },
    });
    
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Skill name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<Skills />);
    
    // Fill out the form
    fireEvent.change(screen.getByTestId('skill-name-input-0'), {
      target: { value: 'JavaScript' },
    });

    // Select skill level
    fireEvent.click(screen.getByTestId('skill-level-select-0'));
    fireEvent.click(screen.getByTestId('skill-level-option-advanced-0'));

    // Select category
    fireEvent.click(screen.getByTestId('skill-category-select-0'));
    fireEvent.click(screen.getByTestId('skill-category-option-programming-languages-0'));

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockStore.addSkill).toHaveBeenCalledWith({
        name: 'JavaScript',
        level: 'Advanced',
        category: 'Programming Languages',
      });
    });
  });

  it('handles multiple skills correctly', async () => {
    render(<Skills />);
    
    // Add first skill
    fireEvent.change(screen.getByTestId('skill-name-input-0'), {
      target: { value: 'JavaScript' },
    });

    // Add another skill
    fireEvent.click(screen.getByTestId('add-skill'));
    
    // Fill out second skill
    fireEvent.change(screen.getByTestId('skill-name-input-1'), {
      target: { value: 'React' },
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockStore.addSkill).toHaveBeenCalledTimes(2);
      expect(mockStore.addSkill).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'JavaScript',
          category: 'Programming Languages',
        })
      );
      expect(mockStore.addSkill).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'React',
          category: 'Programming Languages',
        })
      );
    });
  });
});