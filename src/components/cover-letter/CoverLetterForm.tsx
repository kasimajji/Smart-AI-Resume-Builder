import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useResumeStore } from '@/store/resumeStore';
import type { CoverLetter } from '@/types/resume.types';

const coverLetterSchema = z.object({
  recipientName: z.string().min(2, 'Recipient name must be at least 2 characters'),
  recipientTitle: z.string().min(2, 'Recipient title must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  companyAddress: z.string().min(5, 'Company address must be at least 5 characters'),
  jobTitle: z.string().min(2, 'Job title must be at least 2 characters'),
  resumeId: z.string().min(1, 'Please select a resume'),
});

type CoverLetterForm = Omit<CoverLetter, 'id' | 'content' | 'lastUpdated'>;

export function CoverLetterForm() {
  const { resume } = useResumeStore();
  const { toast } = useToast();

  const form = useForm<CoverLetterForm>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      recipientName: '',
      recipientTitle: '',
      companyName: '',
      companyAddress: '',
      jobTitle: '',
      resumeId: resume?.id || '',
    },
  });

  const onSubmit = (data: CoverLetterForm) => {
    // TODO: Implement cover letter generation logic
    toast({
      title: 'Success',
      description: 'Cover letter details saved successfully',
    });
    console.log('Cover letter form data:', data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Cover Letter Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-testid="cover-letter-form"
          >
            <FormField
              control={form.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., John Smith"
                      {...field}
                      data-testid="recipient-name-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipientTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Hiring Manager"
                      {...field}
                      data-testid="recipient-title-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Acme Corporation"
                      {...field}
                      data-testid="company-name-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 123 Business St, City, State 12345"
                      {...field}
                      data-testid="company-address-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Senior Software Engineer"
                      {...field}
                      data-testid="job-title-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resumeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Resume</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    data-testid="resume-select"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a resume" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resume ? (
                        <SelectItem value={resume.id}>
                          {resume.contactInfo.fullName}'s Resume
                        </SelectItem>
                      ) : (
                        <SelectItem value="" disabled>
                          No resumes available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              data-testid="submit-button"
            >
              Generate Cover Letter
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}