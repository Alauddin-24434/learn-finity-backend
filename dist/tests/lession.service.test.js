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
const AppError_1 = require("../app/error/AppError");
const prisma_1 = require("../app/lib/prisma");
const lession_service_1 = require("../app/modules/Lession/lession.service");
// Mock Prisma
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
describe("lessonService", () => {
    const mockLesson = {
        id: "lesson-1",
        title: "Test Lesson",
        duration: "10:00",
        courseId: "course-1",
        video: "http://example.com/video.mp4",
        videoPublicId: "public-id-123",
        course: { id: "course-1", title: "Test Course" },
        isDeleted: false,
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("createLessonIntoDB", () => {
        it("should create a lesson successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_1.prisma.lesson.create.mockResolvedValue(mockLesson);
            const result = yield lession_service_1.lessonService.createLessonIntoDB(mockLesson);
            expect(prisma_1.prisma.lesson.create).toHaveBeenCalledWith({
                data: {
                    title: mockLesson.title,
                    duration: mockLesson.duration,
                    courseId: mockLesson.courseId,
                    video: mockLesson.video,
                    videoPublicId: mockLesson.videoPublicId,
                },
            });
            expect(result).toEqual(mockLesson);
        }));
        it("should throw error if DB create fails", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_1.prisma.lesson.create.mockRejectedValue(new Error("DB error"));
            yield expect(lession_service_1.lessonService.createLessonIntoDB(mockLesson)).rejects.toThrow("DB error");
        }));
    });
    describe("getAllLessonsFromDB", () => {
        it("should return all lessons", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_1.prisma.lesson.findMany.mockResolvedValue([mockLesson]);
            const result = yield lession_service_1.lessonService.getAllLessonsFromDB();
            expect(prisma_1.prisma.lesson.findMany).toHaveBeenCalledWith({
                include: { course: true },
            });
            expect(result).toEqual([mockLesson]);
        }));
    });
    describe("getSingleLessonFromDB", () => {
        it("should return a lesson if found", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_1.prisma.lesson.findUnique.mockResolvedValue(mockLesson);
            const result = yield lession_service_1.lessonService.getSingleLessonFromDB("lesson-1");
            expect(prisma_1.prisma.lesson.findUnique).toHaveBeenCalledWith({
                where: { id: "lesson-1" },
                include: { course: true },
            });
            expect(result).toEqual(mockLesson);
        }));
        it("should throw AppError if lesson not found", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_1.prisma.lesson.findUnique.mockResolvedValue(null);
            yield expect(lession_service_1.lessonService.getSingleLessonFromDB("lesson-1")).rejects.toThrow(AppError_1.AppError);
        }));
    });
    describe("deleteLessonFromDB", () => {
        it("should soft delete a lesson if found", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_1.prisma.lesson.findUnique.mockResolvedValue(mockLesson);
            prisma_1.prisma.lesson.update.mockResolvedValue(Object.assign(Object.assign({}, mockLesson), { isDeleted: true }));
            const result = yield lession_service_1.lessonService.deleteLessonFromDB("lesson-1");
            expect(prisma_1.prisma.lesson.findUnique).toHaveBeenCalledWith({ where: { id: "lesson-1" } });
            expect(prisma_1.prisma.lesson.update).toHaveBeenCalledWith({
                where: { id: "lesson-1" },
                data: { isDeleted: true },
            });
            expect(result.isDeleted).toBe(true);
        }));
        it("should throw AppError if lesson not found", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_1.prisma.lesson.findUnique.mockResolvedValue(null);
            yield expect(lession_service_1.lessonService.deleteLessonFromDB("lesson-1")).rejects.toThrow(AppError_1.AppError);
        }));
    });
});
