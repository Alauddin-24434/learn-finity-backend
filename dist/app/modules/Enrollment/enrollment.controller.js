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
exports.enrollmentController = void 0;
const enrollment_service_1 = require("./enrollment.service");
const enrollUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const enrollment = yield enrollment_service_1.enrollmetService.createEnrollment(req.body);
    res.status(201).json({ success: true, data: enrollment });
});
exports.enrollmentController = {
    enrollUser
};
