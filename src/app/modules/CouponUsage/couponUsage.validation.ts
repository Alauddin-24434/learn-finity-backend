
import { z } from 'zod';


// validations/couponUsage.validation.ts
export const couponUsageSchema = z.object({

    body: z.object({
        userId: z.string().min(1),
        couponId: z.string().min(1),
    })

});
