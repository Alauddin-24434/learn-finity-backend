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
// src/tests/course.service.test.ts
const course_service_1 = require("../app/modules/Course/course.service");
const prisma_1 = require("../app/lib/prisma");
jest.mock("../app/lib/prisma", () => ({
    prisma: {
        course: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
        },
    },
}));
describe("Course Service", () => {
    const course = {
        title: "Test Course",
        description: "Test description",
        thumbnail: "thumb.jpg",
        overviewVideo: "video.mp4",
        overviewVideoPublicId: "vid123",
        features: ["feat1"],
        overviews: ["ov1"],
        stack: ["stack1"],
        price: 0,
        isFree: true,
        authorId: "1",
        categoryId: "cat1",
        thumbnailPublicId: "dghfgd",
    };
    beforeEach(() => jest.clearAllMocks());
    it("createCourse should create a new course", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.course.findFirst.mockResolvedValue(null);
        prisma_1.prisma.course.create.mockResolvedValue(course);
        const result = yield course_service_1.courseService.createCourse(course);
        // Only check the fields that are passed to prisma.create
        expect(prisma_1.prisma.course.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                title: course.title,
                description: course.description,
                thumbnail: course.thumbnail,
                thumbnailPublicId: course.thumbnailPublicId,
                overviewVideo: course.overviewVideo,
                overviewVideoPublicId: course.overviewVideoPublicId,
                features: course.features,
                overviews: course.overviews,
                stack: course.stack,
                price: course.price,
                isFree: course.isFree,
                authorId: course.authorId,
                categoryId: course.categoryId,
            }),
        }));
        // Result includes createdAt/updatedAt because Prisma mock returns it
        expect(result).toEqual(course);
    }));
    it("createCourse should throw error if course exists", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.course.findFirst.mockResolvedValue(course);
        yield expect(course_service_1.courseService.createCourse(course)).rejects.toThrow();
    }));
    it("getCourseById should return course", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.course.findUnique.mockResolvedValue(course);
        const result = yield course_service_1.courseService.getCourseById("1");
        expect(result).toEqual(course);
    }));
    it("getAllCourses should return paginated courses", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.course.count.mockResolvedValue(1);
        prisma_1.prisma.course.findMany.mockResolvedValue([course]);
        const result = yield course_service_1.courseService.getAllCourses({ page: 1, limit: 10 });
        expect(result.courses).toEqual([course]);
        expect(result.totalPages).toBe(1);
    }));
    it("updateCourseById should update existing course", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.course.findUnique.mockResolvedValue(course);
        prisma_1.prisma.course.update.mockResolvedValue(Object.assign(Object.assign({}, course), { title: "Updated" }));
        const result = yield course_service_1.courseService.updateCourseById("1", { title: "Updated" });
        expect(result.title).toBe("Updated");
    }));
    it("deleteCourseById should soft delete course", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.course.findUnique.mockResolvedValue(course);
        prisma_1.prisma.course.update.mockResolvedValue(Object.assign(Object.assign({}, course), { isDeleted: true }));
        const result = yield course_service_1.courseService.deleteCourseById("1");
        expect(result.isDeleted).toBe(true);
    }));
});
