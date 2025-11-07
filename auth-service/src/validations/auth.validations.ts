import { z } from "zod"
// ----------------------
// Login Validation Schema
// ----------------------
export const loginValidationSchema = z.object({

    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),

})

// -------------------------
// Register Validation Schema
// -------------------------
export const registerValidationSchema = z.object({

    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),


})
