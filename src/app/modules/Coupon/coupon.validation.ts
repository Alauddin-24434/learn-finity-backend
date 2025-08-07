// validations/enrollment.validation.ts
import { z } from 'zod';


// validations/coupon.validation.ts
export const couponSchema = z.object({
    body: z.object({
        code: z.string().min(3),
        discount: z.number().min(1).max(100),
        expiresAt: z.string().datetime(),
        courseIds: z.array(z.string()).optional(),
    })

});

