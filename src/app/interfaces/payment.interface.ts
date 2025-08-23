export interface IPaymentInput {
  userId: string
  courseId: string
  amount: number
  currency: string
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED"
  provider: string
  phone: string;
  transactionId: string
  paidAt?: Date
}
