import { z } from "zod";

export const updateUserSchema = z.object({

  email: z.string().email("Invalid email address").optional(),
  name: z.string().min(3, "Name should be at least 3 characters").optional(),
  password: z.string().min(6, "Password should be at least 6 characters").optional(),
  avatar: z.string().url().optional(),
  role: z.enum(["ADMIN", "SUPER_ADMIN", "STUDENT", "STAFF", "GUEST"]).optional(),

});



export const loginSchema = z.object({

  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),

});
