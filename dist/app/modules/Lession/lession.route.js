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
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.validateRequest)(lession_validation_1.createLessonZodSchema), lession_controller_1.createLesson);
router.get("/", lession_controller_1.getAllLessons);
router.get("/:id", lession_controller_1.getSingleLesson);
router.delete("/:id", lession_controller_1.deleteLesson);
exports.lessonRoutes = router;
