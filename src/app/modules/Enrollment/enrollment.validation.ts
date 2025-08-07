import { z } from 'zod';

export const enrollmentSchema = z.object({
    body: z.object({
        userId: z.string().min(1),
        courseId: z.string().min(1),
    })

});
