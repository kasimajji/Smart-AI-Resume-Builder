import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Resume } from '@/types/resume.types';

interface ResumeStore {
  resume: Resume | null;
  setResume: (resume: Resume) => void;
  updateContactInfo: (contactInfo: Resume['contactInfo']) => void;
  addWorkExperience: (experience: Omit<Resume['workExperience'][0], 'id'>) => void;
  updateWorkExperience: (id: string, experience: Partial<Resume['workExperience'][0]>) => void;
  removeWorkExperience: (id: string) => void;
  addEducation: (education: Omit<Resume['education'][0], 'id'>) => void;
  updateEducation: (id: string, education: Partial<Resume['education'][0]>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Omit<Resume['skills'][0], 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Resume['skills'][0]>) => void;
  removeSkill: (id: string) => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: null,
      setResume: (resume) => set({ resume }),
      updateContactInfo: (contactInfo) =>
        set((state) => ({
          resume: state.resume ? { ...state.resume, contactInfo } : null,
        })),
      addWorkExperience: (experience) =>
        set((state) => ({
          resume: state.resume
            ? {
                ...state.resume,
                workExperience: [
                  ...state.resume.workExperience,
                  { ...experience, id: crypto.randomUUID() },
                ],
              }
            : null,
        })),
      updateWorkExperience: (id, experience) =>
        set((state) => ({
          resume: state.resume
            ? {
                ...state.resume,
                workExperience: state.resume.workExperience.map((exp) =>
                  exp.id === id ? { ...exp, ...experience } : exp
                ),
              }
            : null,
        })),
      removeWorkExperience: (id) =>
        set((state) => ({
          resume: state.resume
            ? {
                ...state.resume,
                workExperience: state.resume.workExperience.filter(
                  (exp) => exp.id !== id
                ),
              }
            : null,
        })),
      addEducation: (education) =>
        set((state) => ({
          resume: state.resume
            ? {
                ...state.resume,
                education: [
                  ...state.resume.education,
                  { ...education, id: crypto.randomUUID() },
                ],
              }
            : null,
        })),
      updateEducation: (id, education) =>
        set((state) => ({
          resume: state.resume
            ? {
                ...state.resume,
                education: state.resume.education.map((edu) =>
                  edu.id === id ? { ...edu, ...education } : edu
                ),
              }
            : null,
        })),
      removeEducation: (id) =>
        set((state) => ({
          resume: state.resume
            ? {
                ...state.resume,
                education: state.resume.education.filter((edu) => edu.id !== id),
              }
            : null,
        })),
      addSkill: (skill) =>
        set((state) => ({
          resume: state.resume
            ? {
                ...state.resume,
                skills: [...state.resume.skills, { ...skill, id: crypto.randomUUID() }],
              }
            : null,
        })),
      updateSkill: (id, skill) =>
        set((state) => ({
          resume: state.resume
            ? {
                ...state.resume,
                skills: state.resume.skills.map((s) =>
                  s.id === id ? { ...s, ...skill } : s
                ),
              }
            : null,
        })),
      removeSkill: (id) =>
        set((state) => ({
          resume: state.resume
            ? {
                ...state.resume,
                skills: state.resume.skills.filter((s) => s.id !== id),
              }
            : null,
        })),
    }),
    {
      name: 'resume-storage',
    }
  )
);