import { z } from "zod"

// Enum for payment status
export const paymentStatusEnum = z.enum(["PENDING", "PAID", "FAILED", "CANCELLED"])
export type PaymentStatus = z.infer<typeof paymentStatusEnum>

// Payment input validation
export const paymentSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "User ID is required"),
    courseId: z.string().min(1, "Course ID is required"),
    phone: z.string("Pnpne number is required"),
    amount: z.number().int().positive("Amount must be a positive integer"),
    currency: z.string().min(1, "Currency is required"), // You can use enum here if it's fixed
    status: paymentStatusEnum.default("PENDING"),
    provider: z.string().min(1, "Provider is required"), // Consider enum if limited values
    transactionId: z.string().optional(),
    paidAt: z.date().optional(),
    
  })
})

