import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(5).max(30),
  password: z.string().min(8).max(50),
});

export const signupSchema = z.object({
  username: z.string().min(5).max(30),
  password: z.string().min(8).max(50),
  email: z.email(),
});
