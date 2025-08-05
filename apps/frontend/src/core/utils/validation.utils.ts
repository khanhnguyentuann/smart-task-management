import { z } from "zod"

export const emailSchema = z.string().email("Invalid email address")

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")

export const projectNameSchema = z
  .string()
  .min(3, "Project name must be at least 3 characters")
  .max(100, "Project name must be less than 100 characters")

export const taskTitleSchema = z
  .string()
  .min(3, "Task title must be at least 3 characters")
  .max(200, "Task title must be less than 200 characters")

export const descriptionSchema = z
  .string()
  .max(1000, "Description must be less than 1000 characters")
  .optional()

export const dateSchema = z.string().refine((date) => {
  const dateObj = new Date(date)
  return !isNaN(dateObj.getTime())
}, "Invalid date")

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
})

export const createProjectSchema = z.object({
  name: projectNameSchema,
  description: descriptionSchema,
  dueDate: dateSchema,
  members: z.array(z.string()).optional(),
})

export const createTaskSchema = z.object({
  title: taskTitleSchema,
  description: descriptionSchema,
  priority: z.enum(["low", "medium", "high"]),
  assignee: z.string().min(1, "Assignee is required"),
  project: z.string().min(1, "Project is required"),
  dueDate: dateSchema,
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type CreateProjectData = z.infer<typeof createProjectSchema>
export type CreateTaskData = z.infer<typeof createTaskSchema> 