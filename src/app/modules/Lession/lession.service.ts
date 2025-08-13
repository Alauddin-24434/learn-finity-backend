import { cloudinary } from "../../lib/cloudinary"
import { prisma } from "../../lib/prisma"

export const createLessonIntoDB = async (payload: {
  title: string
  duration: string
  videoUrl: string
  publicId: string
  courseId: string
}) => {
  try {
    // Try creating the lesson record in DB
    const lesson = await prisma.lesson.create({ data: payload })
    return lesson
  } catch (error) {
    console.error("DB create failed, deleting video from Cloudinary...", error)

    try {
      // Delete video from Cloudinary using publicId
      await cloudinary.uploader.destroy(payload.publicId, { resource_type: "video" })
      console.log("Video deleted from Cloudinary due to DB failure.")
    } catch (deleteError) {
      console.error("Failed to delete video from Cloudinary:", deleteError)
    }

    // Rethrow original error so caller knows DB create failed
    throw error
  }
}
export const getAllLessonsFromDB = async () => {
  return await prisma.lesson.findMany({
    include: {
      course: true,
    },
  })
}

export const getSingleLessonFromDB = async (id: string) => {
  return await prisma.lesson.findUnique({
    where: { id },
    include: {
      course: true,
    },
  })
}

export const deleteLessonFromDB = async (id: string) => {
  return await prisma.lesson.delete({
    where: { id },
  })
}
