import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import type { ContactInfo as ContactInfoType } from '@/types/resume.types';
import { useResumeStore } from '@/store/resumeStore';

/**
 * Schema for contact information validation
 */
const contactInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  website: z.string().url('Invalid URL').optional(),
  linkedin: z.string().url('Invalid URL').optional(),
});

/**
 * ContactInfo Component
 * Handles the contact information section of the resume builder
 */
export function ContactInfo() {
  const { resume, updateContactInfo } = useResumeStore();
  
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* Form fields will be implemented in the next phase */}
        </Form>
      </CardContent>
    </Card>
  );
}