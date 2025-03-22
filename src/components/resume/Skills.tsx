import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Skill as SkillType } from '@/types/resume.types';
import { useResumeStore } from '@/store/resumeStore';

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
const skillCategories = [
  'Programming Languages',
  'Frameworks & Libraries',
  'Tools & Technologies',
  'Soft Skills',
  'Languages',
  'Other',
] as const;

const skillsSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string().min(2, 'Skill name must be at least 2 characters'),
      level: z.enum(skillLevels, {
        required_error: 'Please select a skill level',
      }),
      category: z.string().min(2, 'Category must be at least 2 characters'),
    })
  ),
});

type SkillsForm = {
  skills: Omit<SkillType, 'id'>[];
};

const emptySkill = {
  name: '',
  level: 'Intermediate' as const,
  category: 'Programming Languages',
};

export function Skills() {
  const { resume, addSkill, updateSkill, removeSkill } = useResumeStore();
  const { toast } = useToast();

  const form = useForm<SkillsForm>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: resume?.skills.map((skill) => ({
        name: skill.name,
        level: skill.level,
        category: skill.category,
      })) || [emptySkill],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'skills',
    control: form.control,
  });

  const onSubmit = (data: SkillsForm) => {
    // Remove existing skills
    resume?.skills.forEach((skill) => removeSkill(skill.id));
    
    // Add new skills
    data.skills.forEach((skill) => addSkill(skill));
    
    toast({
      title: 'Success',
      description: 'Skills updated successfully',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-testid="skills-form"
          >
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 p-4 border rounded-lg relative"
                data-testid={`skill-${index}`}
              >
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => remove(index)}
                    data-testid={`remove-skill-${index}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}

                <FormField
                  control={form.control}
                  name={`skills.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., JavaScript, React, Project Management"
                          {...field}
                          data-testid={`skill-name-input-${index}`}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a specific skill or technology you're proficient in
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`skills.${index}.level`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proficiency Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          data-testid={`skill-level-select-${index}`}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {skillLevels.map((level) => (
                              <SelectItem
                                key={level}
                                value={level}
                                data-testid={`skill-level-option-${level.toLowerCase()}-${index}`}
                              >
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`skills.${index}.category`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          data-testid={`skill-category-select-${index}`}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {skillCategories.map((category) => (
                              <SelectItem
                                key={category}
                                value={category}
                                data-testid={`skill-category-option-${category.toLowerCase().replace(/\s+/g, '-')}-${index}`}
                              >
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => append(emptySkill)}
              data-testid="add-skill"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Skill
            </Button>

            <Button
              type="submit"
              className="w-full"
              data-testid="submit-button"
            >
              Save Skills
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}