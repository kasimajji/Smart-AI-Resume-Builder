import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Resume, ContactInfo, WorkExperience, Education, Skill } from '@/types/resume.types';

const emptyContactInfo: ContactInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
};

const emptyResume: Omit<Resume, 'id' | 'lastUpdated'> = {
  contactInfo: emptyContactInfo,
  workExperience: [],
  education: [],
  skills: [],
};

interface ResumeState {
  resumes: Resume[];
  selectedResumeId: string | null;
}

interface ResumeActions {
  // Resume CRUD
  createResume: () => void;
  updateResume: (id: string, resume: Partial<Resume>) => void;
  deleteResume: (id: string) => void;
  
  // Resume Selection
  setSelectedResumeId: (id: string | null) => void;
  getSelectedResume: () => Resume | null;
  
  // Contact Info
  updateContactInfo: (contactInfo: ContactInfo) => void;
  
  // Work Experience
  addWorkExperience: (experience: Omit<WorkExperience, 'id'>) => void;
  updateWorkExperience: (id: string, experience: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  
  // Education
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  
  // Skills
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
}

type ResumeStore = ResumeState & ResumeActions;

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      // Initial State
      resumes: [],
      selectedResumeId: null,

      // Resume CRUD
      createResume: () => {
        const newResume: Resume = {
          ...emptyResume,
          id: crypto.randomUUID(),
          lastUpdated: new Date().toISOString(),
        };

        set((state) => ({
          resumes: [...state.resumes, newResume],
          selectedResumeId: newResume.id,
        }));
      },

      updateResume: (id, resume) =>
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id
              ? { ...r, ...resume, lastUpdated: new Date().toISOString() }
              : r
          ),
        })),

      deleteResume: (id) =>
        set((state) => ({
          resumes: state.resumes.filter((r) => r.id !== id),
          selectedResumeId: state.selectedResumeId === id ? null : state.selectedResumeId,
        })),

      // Resume Selection
      setSelectedResumeId: (id) => set({ selectedResumeId: id }),

      getSelectedResume: () => {
        const state = get();
        return state.resumes.find((r) => r.id === state.selectedResumeId) || null;
      },

      // Contact Info
      updateContactInfo: (contactInfo) => {
        const state = get();
        if (!state.selectedResumeId) return;

        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === state.selectedResumeId
              ? {
                  ...r,
                  contactInfo,
                  lastUpdated: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      // Work Experience
      addWorkExperience: (experience) => {
        const state = get();
        if (!state.selectedResumeId) return;

        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === state.selectedResumeId
              ? {
                  ...r,
                  workExperience: [
                    ...r.workExperience,
                    { ...experience, id: crypto.randomUUID() },
                  ],
                  lastUpdated: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      updateWorkExperience: (id, experience) => {
        const state = get();
        if (!state.selectedResumeId) return;

        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === state.selectedResumeId
              ? {
                  ...r,
                  workExperience: r.workExperience.map((exp) =>
                    exp.id === id ? { ...exp, ...experience } : exp
                  ),
                  lastUpdated: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      removeWorkExperience: (id) => {
        const state = get();
        if (!state.selectedResumeId) return;

        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === state.selectedResumeId
              ? {
                  ...r,
                  workExperience: r.workExperience.filter((exp) => exp.id !== id),
                  lastUpdated: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      // Education
      addEducation: (education) => {
        const state = get();
        if (!state.selectedResumeId) return;

        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === state.selectedResumeId
              ? {
                  ...r,
                  education: [
                    ...r.education,
                    { ...education, id: crypto.randomUUID() },
                  ],
                  lastUpdated: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      updateEducation: (id, education) => {
        const state = get();
        if (!state.selectedResumeId) return;

        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === state.selectedResumeId
              ? {
                  ...r,
                  education: r.education.map((edu) =>
                    edu.id === id ? { ...edu, ...education } : edu
                  ),
                  lastUpdated: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      removeEducation: (id) => {
        const state = get();
        if (!state.selectedResumeId) return;

        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === state.selectedResumeId
              ? {
                  ...r,
                  education: r.education.filter((edu) => edu.id !== id),
                  lastUpdated: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      // Skills
      addSkill: (skill) => {
        const state = get();
        if (!state.selectedResumeId) return;

        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === state.selectedResumeId
              ? {
                  ...r,
                  skills: [...r.skills, { ...skill, id: crypto.randomUUID() }],
                  lastUpdated: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      updateSkill: (id, skill) => {
        const state = get();
        if (!state.selectedResumeId) return;

        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === state.selectedResumeId
              ? {
                  ...r,
                  skills: r.skills.map((s) =>
                    s.id === id ? { ...s, ...skill } : s
                  ),
                  lastUpdated: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      removeSkill: (id) => {
        const state = get();
        if (!state.selectedResumeId) return;

        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === state.selectedResumeId
              ? {
                  ...r,
                  skills: r.skills.filter((s) => s.id !== id),
                  lastUpdated: new Date().toISOString(),
                }
              : r
          ),
        }));
      },
    }),
    {
      name: 'resume-storage',
      version: 1,
    }
  )
);