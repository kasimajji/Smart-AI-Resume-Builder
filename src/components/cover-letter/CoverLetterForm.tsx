import { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useResumeStore } from '@/store/resumeStore';
import { CoverLetterPreview } from './CoverLetterPreview';
import { generateCoverLetter } from '@/lib/ai';
import type { CoverLetter } from '@/types/resume.types';
import { format } from 'date-fns';

const coverLetterSchema = z.object({
  recipientName: z.string().min(2, 'Recipient name must be at least 2 characters'),
  recipientTitle: z.string().min(2, 'Recipient title must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  companyAddress: z.string().min(5, 'Company address must be at least 5 characters'),
  jobTitle: z.string().min(2, 'Job title must be at least 2 characters'),
  resumeId: z.string().min(1, 'Please select a resume'),
});

type CoverLetterForm = z.infer<typeof coverLetterSchema>;

export function CoverLetterForm() {
  const { resumes, selectedResumeId, setSelectedResumeId } = useResumeStore();
  const { toast } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const form = useForm<CoverLetterForm>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      recipientName: '',
      recipientTitle: '',
      companyName: '',
      companyAddress: '',
      jobTitle: '',
      resumeId: selectedResumeId || '',
    },
  });

  const onSubmit = async (data: CoverLetterForm) => {
    try {
      setIsGenerating(true);
      const selectedResume = resumes.find((r) => r.id === data.resumeId);

      if (!selectedResume) {
        toast({
          title: 'Error',
          description: 'Please select a resume first',
          variant: 'destructive',
        });
        return;
      }

      const content = await generateCoverLetter({
        ...data,
        resume: selectedResume,
      });

      setGeneratedContent(content);
      setPreviewOpen(true);

      toast({
        title: 'Success',
        description: 'Cover letter generated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate cover letter',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Cover Letter Details</CardTitle>
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="preview-button">
                Preview Cover Letter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cover Letter Preview</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <CoverLetterPreview 
                  coverLetter={{
                    ...form.getValues(),
                    content: generatedContent || '',
                  }} 
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
              name="resumeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Resume</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedResumeId(value);
                    }}
                    defaultValue={field.value}
                    data-testid="resume-select"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a resume" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resumes.length > 0 ? (
                        resumes.map((resume) => (
                          <SelectItem
                            key={resume.id}
                            value={resume.id}
                            data-testid={`resume-option-${resume.id}`}
                          >
                            {resume.contactInfo.fullName}'s Resume ({format(new Date(resume.lastUpdated), 'MMM d, yyyy')})
                          </SelectItem>
                        ))
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

            <Button
              type="submit"
              className="w-full"
              data-testid="submit-button"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating Cover Letter...' : 'Generate Cover Letter'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}