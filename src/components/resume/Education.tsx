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
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Education as EducationType } from '@/types/resume.types';
import { useResumeStore } from '@/store/resumeStore';

const educationSchema = z.object({
  education: z.array(
    z.object({
      institution: z.string().min(2, 'Institution name must be at least 2 characters'),
      degree: z.string().min(2, 'Degree must be at least 2 characters'),
      field: z.string().min(2, 'Field of study must be at least 2 characters'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().min(1, 'End date is required'),
      location: z.string().min(2, 'Location must be at least 2 characters'),
      gpa: z.number().min(0).max(4).optional(),
    })
  ),
});

type EducationForm = {
  education: Omit<EducationType, 'id'>[];
};

const emptyEducation = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  location: '',
  gpa: undefined,
};

export function Education() {
  const { resume, addEducation, updateEducation, removeEducation } = useResumeStore();
  const { toast } = useToast();

  const form = useForm<EducationForm>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: resume?.education.map((edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        startDate: edu.startDate,
        endDate: edu.endDate,
        location: edu.location,
        gpa: edu.gpa,
      })) || [emptyEducation],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'education',
    control: form.control,
  });

  const onSubmit = (data: EducationForm) => {
    // Remove existing education entries
    resume?.education.forEach((edu) => removeEducation(edu.id));
    
    // Add new education entries
    data.education.forEach((edu) => addEducation(edu));
    
    toast({
      title: 'Success',
      description: 'Education information updated successfully',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Education</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-testid="education-form"
          >
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 p-4 border rounded-lg relative"
                data-testid={`education-${index}`}
              >
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => remove(index)}
                    data-testid={`remove-education-${index}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}

                <FormField
                  control={form.control}
                  name={`education.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="University or School Name"
                          {...field}
                          data-testid={`institution-input-${index}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`education.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Bachelor's, Master's, etc."
                          {...field}
                          data-testid={`degree-input-${index}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`education.${index}.field`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Computer Science, Business, etc."
                          {...field}
                          data-testid={`field-input-${index}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`education.${index}.location`}
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
                    name={`education.${index}.startDate`}
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
                    name={`education.${index}.endDate`}
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
                  name={`education.${index}.gpa`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GPA (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="4"
                          placeholder="4.0"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value ? parseFloat(value) : undefined);
                          }}
                          data-testid={`gpa-input-${index}`}
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
              onClick={() => append(emptyEducation)}
              data-testid="add-education"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Education
            </Button>

            <Button
              type="submit"
              className="w-full"
              data-testid="submit-button"
            >
              Save Education
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}