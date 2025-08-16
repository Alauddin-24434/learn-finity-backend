"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middleware/validateRequest");
const lession_validation_1 = require("./lession.validation");
const lession_controller_1 = require("./lession.controller");
const cloudinary_1 = require("../../lib/cloudinary");
const authenticate_1 = require("../../middleware/authenticate");
const router = express_1.default.Router();
router.post("/", cloudinary_1.upload.fields([{ name: "video", maxCount: 1 }]), (0, validateRequest_1.validateRequest)(lession_validation_1.createLessonZodSchema), lession_controller_1.createLesson);
router.get("/", lession_controller_1.getAllLessons);
router.get("/:id", authenticate_1.authenticate, lession_controller_1.lessonController.getLessonByCourseId);
router.delete("/:id", lession_controller_1.deleteLesson);
router.patch('/progress', authenticate_1.authenticate, lession_controller_1.lessonController.updateLessonProgress);
exports.lessonRoutes = router;
