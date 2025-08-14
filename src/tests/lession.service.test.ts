// src/tests/lesson.service.test.ts
import { lessonService } from "../app/modules/Lession/lession.service";
import { prisma } from "../app/lib/prisma";
import { ILesson } from "../app/modules/Lession/lession.interface";
import { AppError } from "../app/error/AppError";

// Mock Prisma only
jest.mock("../app/lib/prisma", () => ({
  prisma: {
    lesson: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("Lesson Service", () => {
  const lesson: ILesson = {
    title: "Test Lesson",
    duration: "10:00",
    courseId: "course-1",
    video: "video.mp4",
    videoPublicId: "vid123",
  };

  beforeEach(() => jest.clearAllMocks());

  it("createLessonIntoDB should create a new lesson", async () => {
    (prisma.lesson.create as jest.Mock).mockResolvedValue(lesson);

    const result = await lessonService.createLessonIntoDB(lesson);

    expect(prisma.lesson.create).toHaveBeenCalledWith({
      data: {
        title: lesson.title,
        duration: lesson.duration,
        courseId: lesson.courseId,
        video: lesson.video,
        videoPublicId: lesson.videoPublicId,
      },
    });

    expect(result).toEqual(lesson);
  });

  it("getAllLessonsFromDB should return all lessons", async () => {
    (prisma.lesson.findMany as jest.Mock).mockResolvedValue([lesson]);

    const result = await lessonService.getAllLessonsFromDB();

    expect(prisma.lesson.findMany).toHaveBeenCalledWith({
      include: { course: true },
    });
    expect(result).toEqual([lesson]);
  });

  it("getSingleLessonFromDB should return lesson if found", async () => {
    (prisma.lesson.findUnique as jest.Mock).mockResolvedValue(lesson);

    const result = await lessonService.getSingleLessonFromDB("lesson-1");

    expect(prisma.lesson.findUnique).toHaveBeenCalledWith({
      where: { id: "lesson-1" },
      include: { course: true },
    });
    expect(result).toEqual(lesson);
  });

  it("getSingleLessonFromDB should throw AppError if not found", async () => {
    (prisma.lesson.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(lessonService.getSingleLessonFromDB("lesson-1")).rejects.toThrow(AppError);
  });

  it("deleteLessonFromDB should soft delete a lesson", async () => {
    (prisma.lesson.findUnique as jest.Mock).mockResolvedValue(lesson);
    (prisma.lesson.update as jest.Mock).mockResolvedValue({ ...lesson, isDeleted: true });

    const result = await lessonService.deleteLessonFromDB("lesson-1");

    expect(prisma.lesson.findUnique).toHaveBeenCalledWith({ where: { id: "lesson-1" } });
    expect(prisma.lesson.update).toHaveBeenCalledWith({
      where: { id: "lesson-1" },
      data: { isDeleted: true },
    });
    expect(result.isDeleted).toBe(true);
  });

  it("deleteLessonFromDB should throw AppError if lesson not found", async () => {
    (prisma.lesson.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(lessonService.deleteLessonFromDB("lesson-1")).rejects.toThrow(AppError);
  });
});
