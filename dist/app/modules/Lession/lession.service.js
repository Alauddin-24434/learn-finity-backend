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
exports.deleteLessonFromDB = exports.getSingleLessonFromDB = exports.getAllLessonsFromDB = exports.createLessonIntoDB = void 0;
const prisma_1 = require("../../lib/prisma");
const createLessonIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const lesson = yield prisma_1.prisma.lesson.create({ data: payload });
    return lesson;
});
exports.createLessonIntoDB = createLessonIntoDB;
const getAllLessonsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.lesson.findMany({
        include: {
            course: true,
        },
    });
});
exports.getAllLessonsFromDB = getAllLessonsFromDB;
const getSingleLessonFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.lesson.findUnique({
        where: { id },
        include: {
            course: true,
        },
    });
});
exports.getSingleLessonFromDB = getSingleLessonFromDB;
const deleteLessonFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.lesson.delete({
        where: { id },
    });
});
exports.deleteLessonFromDB = deleteLessonFromDB;
