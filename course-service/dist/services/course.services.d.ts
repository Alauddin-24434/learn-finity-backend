import { ICourse } from "../interfaces/course.interfaces";
export declare const courseService: {
    createCourse: (data: ICourse) => Promise<{
        id: string;
        title: string;
        description: string;
        thumbnail: string;
        overviewUrl: string;
        price: number;
        isFree: boolean;
        categoryId: string;
        authorId: string;
        tags: string[];
        features: string[];
        overviews: string[];
        stack: string[];
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCourseById: (id: string, userId: string) => Promise<{
        lessonsCount: number;
        category: {
            id: string;
            isDeleted: boolean;
            name: string;
        };
        id: string;
        title: string;
        description: string;
        thumbnail: string;
        overviewUrl: string;
        price: number;
        isFree: boolean;
        categoryId: string;
        authorId: string;
        tags: string[];
        features: string[];
        overviews: string[];
        stack: string[];
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllCourses: (query: any) => Promise<{
        totalPages: number;
        currentPage: any;
        totalCourses: number;
    }>;
    getCoursesByAuthor: (authorId: string) => Promise<({
        category: {
            id: string;
            isDeleted: boolean;
            name: string;
        };
    } & {
        id: string;
        title: string;
        description: string;
        thumbnail: string;
        overviewUrl: string;
        price: number;
        isFree: boolean;
        categoryId: string;
        authorId: string;
        tags: string[];
        features: string[];
        overviews: string[];
        stack: string[];
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    updateCourseById: (id: string, data: ICourse) => Promise<void>;
    softDeleteCourseById: (authorId: string, id: string) => Promise<{
        id: string;
        title: string;
        description: string;
        thumbnail: string;
        overviewUrl: string;
        price: number;
        isFree: boolean;
        categoryId: string;
        authorId: string;
        tags: string[];
        features: string[];
        overviews: string[];
        stack: string[];
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    restoreCourseById: (id: string) => Promise<{
        id: string;
        title: string;
        description: string;
        thumbnail: string;
        overviewUrl: string;
        price: number;
        isFree: boolean;
        categoryId: string;
        authorId: string;
        tags: string[];
        features: string[];
        overviews: string[];
        stack: string[];
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=course.services.d.ts.map