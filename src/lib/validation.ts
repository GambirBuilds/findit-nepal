import { z } from 'zod';

export const reportFormSchema = z.object({
  item_name: z
    .string()
    .min(3, { message: 'Item name must be at least 3 characters.' })
    .max(100, { message: 'Item name must be under 100 characters.' }),
  category: z
    .string()
    .min(1, { message: 'Please select a category.' }),
  description: z
    .string()
    .min(20, { message: 'Description must contain at least 20 characters.' })
    .max(1500, { message: 'Description cannot exceed 1500 characters.' }),
  location: z
    .string()
    .min(3, { message: 'Please provide a valid location.' })
    .max(150, { message: 'Location cannot exceed 150 characters.' }),
  date_occurred: z
    .string()
    .min(1, { message: 'Please select a valid date.' })
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed <= new Date(Date.now() + 86400000);
    }, { message: 'Date cannot be in the future.' }),
  contact_email: z
    .string()
    .email({ message: 'Please enter a valid email address.' }),
  image_url: z.string().optional().nullable(),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  full_name: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const contactOwnerSchema = z.object({
  sender_name: z.string().min(2, { message: 'Your name is required.' }),
  sender_email: z.string().email({ message: 'Please enter your valid email.' }),
  message: z.string().min(15, { message: 'Please write a message of at least 15 characters describing proof of ownership or reunion details.' }),
});

export type ContactOwnerFormValues = z.infer<typeof contactOwnerSchema>;
