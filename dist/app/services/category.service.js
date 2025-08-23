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
exports.restoreCategory = exports.softDeleteCategory = exports.getAllCategoriesInDb = exports.createCategory = void 0;
const prisma_1 = require("../lib/prisma");
/**
 * @desc Create a new category
 * @param name - Name of the category
 * @returns Newly created category object
 * @throws Error if category already exists (and not soft-deleted)
 */
const createCategory = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.prisma.category.findFirst({
        where: { name, isDeleted: false },
    });
    if (existing)
        throw new Error("Category already exists");
    const category = yield prisma_1.prisma.category.create({ data: { name } });
    return category;
});
exports.createCategory = createCategory;
/**
 * @desc Get all categories (excluding soft-deleted ones)
 * @returns Array of category objects
 */
const getAllCategoriesInDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.prisma.category.findMany({
        where: { isDeleted: false },
    });
    return categories;
});
exports.getAllCategoriesInDb = getAllCategoriesInDb;
/**
 * @desc Soft delete a category by ID (marks isDeleted = true)
 * @param id - Category ID
 * @returns Updated category object
 */
const softDeleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma_1.prisma.category.update({
        where: { id },
        data: { isDeleted: true },
    });
    return category;
});
exports.softDeleteCategory = softDeleteCategory;
/**
 * @desc Restore a soft-deleted category by ID (marks isDeleted = false)
 * @param id - Category ID
 * @returns Updated category object
 */
const restoreCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma_1.prisma.category.update({
        where: { id },
        data: { isDeleted: false },
    });
    return category;
});
exports.restoreCategory = restoreCategory;
