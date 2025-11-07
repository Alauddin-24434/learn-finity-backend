"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middlewares/authenticate");
const course_controllers_1 = require("../controllers/course.controllers");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.post("/", authenticate_1.authenticate, multer_1.upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "overviewUrl", maxCount: 1 },
]), course_controllers_1.courseController.createCourse);
router.get("/", course_controllers_1.courseController.getAllCourses);
// router.get("/:id",  courseController.getCourseById);
// router.patch("/:id", authenticate, courseController.updateCourseById);
// router.get("/author/:authorId", authenticate, courseController.getCoursesByAuthor);
// router.delete("/:id/delete", authenticate, courseController.softDeleteCourseById);
// router.patch("/:id/restore", authenticate, courseController.restoreCourseById);
exports.courseRoutes = router;
//# sourceMappingURL=course.routes.js.map