import { Request, Response } from "express";
export declare const courseController: {
    createCourse: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCourseById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllCourses: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateCourseById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    softDeleteCourseById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    restoreCourseById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCoursesByAuthor: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=course.controllers.d.ts.map