import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const movieSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().trim().min(1, "Description is required"),
  genre: z.string().trim().min(1, "Genre is required").max(100),
  releaseYear: z.coerce
    .number()
    .int()
    .min(1888, "Invalid release year")
    .max(new Date().getFullYear() + 5),
  posterUrl: z
    .string()
    .trim()
    .url("Poster must be a valid URL")
    .optional()
    .or(z.literal("")),
});
