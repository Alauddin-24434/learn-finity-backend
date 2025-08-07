export interface ICoupon {
  code: string;
  discount: number;
  expiresAt: string; // ISO string
  courseIds?: string[];
}