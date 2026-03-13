import { z } from "zod";

export const adminSetupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const newsSchema = z.object({
  title: z.string().min(1),
  titleAm: z.string().min(1),
  excerpt: z.string().min(1),
  excerptAm: z.string().min(1),
  content: z.string().min(1),
  contentAm: z.string().min(1),
  date: z.string().datetime().optional(),
  image: z.string().min(1),
  category: z.string().min(1),
  status: z.enum(["published", "draft"]).optional()
});

export const registrationSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  church: z.string().min(1),
  country: z.string().min(1),
  tiktokUsername: z.string().min(1),
  contentType: z.array(z.string()).min(1),
  otherPlatforms: z.array(z.string()).optional().default([]),
  contribution: z.string().min(1),
  availability: z.enum(["available100", "dependsCircumstances", "cannotCommit"]),
  ethicsStatement: z.string().optional(),
  agreeToCovenant: z.boolean()
});

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1)
});

export const teamSchema = z.object({
  name: z.string().min(1),
  nameAm: z.string().min(1),
  role: z.string().min(1),
  roleAm: z.string().min(1),
  image: z.string().min(1),
  order: z.number().int().nonnegative()
});

export const mediaSchema = z.object({
  type: z.enum(["photo", "video"]),
  title: z.string().min(1),
  titleAm: z.string().min(1),
  url: z.string().min(1),
  thumbnail: z.string().optional()
});
