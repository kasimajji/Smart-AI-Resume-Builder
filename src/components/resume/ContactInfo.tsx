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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { ContactInfo as ContactInfoType } from '@/types/resume.types';
import { useResumeStore } from '@/store/resumeStore';

const contactInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      'Invalid phone number format'
    ),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters'),
  website: z
    .string()
    .url('Invalid website URL')
    .max(200, 'Website URL must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  linkedin: z
    .string()
    .url('Invalid LinkedIn URL')
    .max(200, 'LinkedIn URL must be less than 200 characters')
    .regex(
      /^https?:\/\/(www\.)?linkedin\.com\/.*$/,
      'Must be a valid LinkedIn URL'
    )
    .optional()
    .or(z.literal('')),
});

export function ContactInfo() {
  const { resume, updateContactInfo } = useResumeStore();
  const { toast } = useToast();

  const form = useForm<ContactInfoType>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: resume?.contactInfo || {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
    },
  });

  const onSubmit = (data: ContactInfoType) => {
    updateContactInfo(data);
    toast({
      title: 'Success',
      description: 'Contact information updated successfully',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            data-testid="contact-form"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      data-testid="fullName-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                      data-testid="email-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(123) 456-7890"
                      {...field}
                      data-testid="phone-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="City, Country"
                      {...field}
                      data-testid="location-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Website (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://yourwebsite.com"
                      {...field}
                      data-testid="website-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://linkedin.com/in/johndoe"
                      {...field}
                      data-testid="linkedin-input"
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
            >
              Save Contact Information
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}