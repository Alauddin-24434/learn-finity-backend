"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/tests/lesson.service.test.ts
const lession_service_1 = require("../app/modules/Lession/lession.service");
const prisma_1 = require("../app/lib/prisma");
const AppError_1 = require("../app/error/AppError");
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
    const lesson = {
        title: "Test Lesson",
        duration: "10:00",
        courseId: "course-1",
        video: "video.mp4",
        videoPublicId: "vid123",
    };
    beforeEach(() => jest.clearAllMocks());
    it("createLessonIntoDB should create a new lesson", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.lesson.create.mockResolvedValue(lesson);
        const result = yield lession_service_1.lessonService.createLessonIntoDB(lesson);
        expect(prisma_1.prisma.lesson.create).toHaveBeenCalledWith({
            data: {
                title: lesson.title,
                duration: lesson.duration,
                courseId: lesson.courseId,
                video: lesson.video,
                videoPublicId: lesson.videoPublicId,
            },
        });
        expect(result).toEqual(lesson);
    }));
    it("getAllLessonsFromDB should return all lessons", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.lesson.findMany.mockResolvedValue([lesson]);
        const result = yield lession_service_1.lessonService.getAllLessonsFromDB();
        expect(prisma_1.prisma.lesson.findMany).toHaveBeenCalledWith({
            include: { course: true },
        });
        expect(result).toEqual([lesson]);
    }));
    it("getSingleLessonFromDB should return lesson if found", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.lesson.findUnique.mockResolvedValue(lesson);
        const result = yield lession_service_1.lessonService.getSingleLessonFromDB("lesson-1");
        expect(prisma_1.prisma.lesson.findUnique).toHaveBeenCalledWith({
            where: { id: "lesson-1" },
            include: { course: true },
        });
        expect(result).toEqual(lesson);
    }));
    it("getSingleLessonFromDB should throw AppError if not found", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.lesson.findUnique.mockResolvedValue(null);
        yield expect(lession_service_1.lessonService.getSingleLessonFromDB("lesson-1")).rejects.toThrow(AppError_1.AppError);
    }));
    it("deleteLessonFromDB should soft delete a lesson", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.lesson.findUnique.mockResolvedValue(lesson);
        prisma_1.prisma.lesson.update.mockResolvedValue(Object.assign(Object.assign({}, lesson), { isDeleted: true }));
        const result = yield lession_service_1.lessonService.deleteLessonFromDB("lesson-1");
        expect(prisma_1.prisma.lesson.findUnique).toHaveBeenCalledWith({ where: { id: "lesson-1" } });
        expect(prisma_1.prisma.lesson.update).toHaveBeenCalledWith({
            where: { id: "lesson-1" },
            data: { isDeleted: true },
        });
        expect(result.isDeleted).toBe(true);
    }));
    it("deleteLessonFromDB should throw AppError if lesson not found", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.lesson.findUnique.mockResolvedValue(null);
        yield expect(lession_service_1.lessonService.deleteLessonFromDB("lesson-1")).rejects.toThrow(AppError_1.AppError);
    }));
});
