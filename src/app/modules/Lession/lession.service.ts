import { prisma } from "../../lib/prisma"

export const createLessonIntoDB = async (payload: {
  title: string
  duration: string
  videoUrl: string
  courseId: string
}) => {
  const lesson = await prisma.lesson.create({ data: payload })
  return lesson
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
