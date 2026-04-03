import z from "zod";
export const signUpPostRequestBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.email(),
  password: z.string().min(3),
});
export const signInPostRequestBodySchema = z.object({
  email: z.email(),
  password: z.string().min(3),
});

export const shortenPostRequestBodySchema = z.object({
  url: z.url(),
  code: z.string().optional(),
});
