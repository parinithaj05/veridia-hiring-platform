import { uid } from "@/lib/utils";
import type { Application } from "@/types/application";

export const seedApplications = (): Application[] => [
  {
    id: uid(),
    userId: "seed-user-1",
    position: "Frontend Developer",
    firstName: "Ava",
    lastName: "Nguyen",
    email: "ava@example.com",
    phone: "1234567890",
    motivation: "I love building UI and collaborating with teams.",
    status: "Under Review",
    submittedAt: new Date().toISOString(),
  },
  {
    id: uid(),
    userId: "seed-user-2",
    position: "Backend Developer",
    firstName: "Liam",
    lastName: "Khan",
    email: "liam@example.com",
    phone: "9876543210",
    motivation: "Solid experience with APIs and databases.",
    status: "Submitted",
    submittedAt: new Date().toISOString(),
  },
];