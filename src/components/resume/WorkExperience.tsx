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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { WorkExperience as WorkExperienceType } from '@/types/resume.types';
import { useResumeStore } from '@/store/resumeStore';

const workExperienceSchema = z.object({
  experiences: z.array(
    z.object({
      company: z.string().min(2, 'Company name must be at least 2 characters'),
      position: z.string().min(2, 'Position must be at least 2 characters'),
      location: z.string().min(2, 'Location must be at least 2 characters'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().min(1, 'End date is required'),
      current: z.boolean().default(false),
      description: z.array(z.string().min(1, 'Description cannot be empty')).min(1, 'At least one bullet point is required'),
    })
  ),
});

type WorkExperienceForm = {
  experiences: Omit<WorkExperienceType, 'id'>[];
};

const emptyExperience = {
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: [''],
};

export function WorkExperience() {
  const { resume, addWorkExperience, updateWorkExperience, removeWorkExperience } = useResumeStore();
  const { toast } = useToast();

  const form = useForm<WorkExperienceForm>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      experiences: resume?.workExperience.map((exp) => ({
        company: exp.company,
        position: exp.position,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.current,
        description: exp.description,
      })) || [emptyExperience],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'experiences',
    control: form.control,
  });

  const onSubmit = (data: WorkExperienceForm) => {
    // Remove existing experiences
    resume?.workExperience.forEach((exp) => removeWorkExperience(exp.id));
    
    // Add new experiences
    data.experiences.forEach((exp) => addWorkExperience(exp));
    
    toast({
      title: 'Success',
      description: 'Work experience updated successfully',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Work Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-testid="work-experience-form"
          >
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 p-4 border rounded-lg relative"
                data-testid={`experience-${index}`}
              >
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => remove(index)}
                    data-testid={`remove-experience-${index}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}

                <FormField
                  control={form.control}
                  name={`experiences.${index}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Company Name"
                          {...field}
                          data-testid={`company-input-${index}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`experiences.${index}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Job Title"
                          {...field}
                          data-testid={`position-input-${index}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`experiences.${index}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City, Country"
                          {...field}
                          data-testid={`location-input-${index}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input
                            type="month"
                            {...field}
                            data-testid={`start-date-input-${index}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`experiences.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input
                            type="month"
                            {...field}
                            data-testid={`end-date-input-${index}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`experiences.${index}.description.0`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your responsibilities and achievements..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid={`description-input-${index}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => append(emptyExperience)}
              data-testid="add-experience"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Experience
            </Button>

            <Button
              type="submit"
              className="w-full"
              data-testid="submit-button"
            >
              Save Work Experience
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}