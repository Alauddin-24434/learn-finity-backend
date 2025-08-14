// src/tests/course.service.test.ts
import { courseService } from "../app/modules/Course/course.service";
import { prisma } from "../app/lib/prisma";
import { ICourse } from "../app/modules/Course/course.interface";

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
  const course:ICourse= {
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

  it("createCourse should create a new course", async () => {
    (prisma.course.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.course.create as jest.Mock).mockResolvedValue(course);

    const result = await courseService.createCourse(course as ICourse);

    // Only check the fields that are passed to prisma.create
    expect(prisma.course.create).toHaveBeenCalledWith(
      expect.objectContaining({
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
      })
    );

    // Result includes createdAt/updatedAt because Prisma mock returns it
    expect(result).toEqual(course);
  });

  it("createCourse should throw error if course exists", async () => {
    (prisma.course.findFirst as jest.Mock).mockResolvedValue(course);
    await expect(courseService.createCourse(course)).rejects.toThrow();
  });

  it("getCourseById should return course", async () => {
    (prisma.course.findUnique as jest.Mock).mockResolvedValue(course);
    const result = await courseService.getCourseById("1");
    expect(result).toEqual(course);
  });

  it("getAllCourses should return paginated courses", async () => {
    (prisma.course.count as jest.Mock).mockResolvedValue(1);
    (prisma.course.findMany as jest.Mock).mockResolvedValue([course]);
    const result = await courseService.getAllCourses({ page: 1, limit: 10 });
    expect(result.courses).toEqual([course]);
    expect(result.totalPages).toBe(1);
  });

  it("updateCourseById should update existing course", async () => {
    (prisma.course.findUnique as jest.Mock).mockResolvedValue(course);
    (prisma.course.update as jest.Mock).mockResolvedValue({ ...course, title: "Updated" });
    const result = await courseService.updateCourseById("1", { title: "Updated" });
    expect(result.title).toBe("Updated");
  });

  it("deleteCourseById should soft delete course", async () => {
    (prisma.course.findUnique as jest.Mock).mockResolvedValue(course);
    (prisma.course.update as jest.Mock).mockResolvedValue({ ...course, isDeleted: true });
    const result = await courseService.deleteCourseById("1");
    expect(result.isDeleted).toBe(true);
  });
});
