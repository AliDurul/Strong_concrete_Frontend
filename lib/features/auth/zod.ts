import { z } from 'zod';

export const credentialsSchema = z.object({
    fullname: z.string().min(3, "Full name is required").optional(),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password must be no more than 20 characters long")
        .refine((val) => /[A-Z]/.test(val), "Password must include at least one uppercase letter")
        .refine((val) => /[a-z]/.test(val), "Password must include at least one lowercase letter")
});
