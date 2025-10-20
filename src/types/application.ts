import { z } from "zod";

export const ApplicationStatus = z.enum([
  "Draft",
  "Submitted",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Hired",
  "Waitlisted",
]);
export type ApplicationStatus = z.infer<typeof ApplicationStatus>;

export const StatusEventSchema = z.object({
  status: ApplicationStatus,
  at: z.string(),            // ISO timestamp
  by: z.string().optional(), // e.g., Admin name
  note: z.string().optional()
});
export type StatusEvent = z.infer<typeof StatusEventSchema>;

export const ApplicationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  position: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  motivation: z.string().min(10),
  status: ApplicationStatus,
  submittedAt: z.string().optional(),
  notes: z.string().optional(),
  history: z.array(StatusEventSchema).optional(),
});
export type Application = z.infer<typeof ApplicationSchema>;