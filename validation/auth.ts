import { z } from "zod";

export const SettingsSchema = z.object({
  name: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: "email is required." }),
  password: z.string().min(1, { message: "password is required" }),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(3, { message: "name is required." }),
    email: z.string().email({ message: "email is required." }),
    password: z.string().min(6, { message: "minimum 6 characters required" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password doesn't match",
    path: ["confirmPassword"],
  });

export const ResetSchema = z.object({
  email: z.string().email({ message: "email is required." }),
});

export const newPasswordSchema = z
  .object({
    password: z.string().min(6, { message: "minimum 6 characters required" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password doesn't match",
    path: ["confirmPassword"],
  });
