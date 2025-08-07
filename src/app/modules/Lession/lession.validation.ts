import { z } from "zod"

export const createLessonZodSchema = z.object({
  body: z.object({
    title: z.string("Title is required"),
    duration: z.string( "Duration is required"),
    videoUrl: z.string("Video URL is required"),
    courseId: z.string("Course ID is required"),
  }),
})
