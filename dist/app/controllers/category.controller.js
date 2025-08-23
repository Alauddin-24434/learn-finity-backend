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
exports.restoreCategoryHandler = exports.softDeleteCategoryHandler = exports.getAllCategories = exports.createCategoryHandler = void 0;
const category_service_1 = require("../services/category.service");
const catchAsyncHandler_1 = require("../utils/catchAsyncHandler");
const sendResponse_1 = require("../utils/sendResponse");
// Create a new category
exports.createCategoryHandler = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: "Category name is required" });
    }
    const category = yield (0, category_service_1.createCategory)(name);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Category created successfully",
        data: category,
    });
}));
// Get all categories (excluding soft-deleted)
exports.getAllCategories = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield (0, category_service_1.getAllCategoriesInDb)();
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully",
        data: categories,
    });
}));
// Soft delete a category
exports.softDeleteCategoryHandler = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield (0, category_service_1.softDeleteCategory)(id);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Category soft-deleted successfully",
        data: category,
    });
}));
// Restore a soft-deleted category
exports.restoreCategoryHandler = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield (0, category_service_1.restoreCategory)(id);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Category restored successfully",
        data: category,
    });
}));
