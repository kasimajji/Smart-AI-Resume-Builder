import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import type { Skill as SkillType } from '@/types/resume.types';
import { useResumeStore } from '@/store/resumeStore';

/**
 * Schema for skills validation
 */
const skillsSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string().min(2, 'Skill name must be at least 2 characters'),
      level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
      category: z.string().min(2, 'Category must be at least 2 characters'),
    })
  ),
});

type SkillsForm = {
  skills: Omit<SkillType, 'id'>[];
};

/**
 * Skills Component
 * Manages the skills section of the resume builder
 */
export function Skills() {
  const { resume, addSkill, updateSkill, removeSkill } = useResumeStore();

  const form = useForm<SkillsForm>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: resume?.skills.map((skill) => ({
        name: skill.name,
        level: skill.level,
        category: skill.category,
      })) || [],
    },
  });

  const { fields } = useFieldArray({
    name: 'skills',
    control: form.control,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* Form fields will be implemented in the next phase */}
        </Form>
      </CardContent>
    </Card>
  );
}