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
exports.overviewDashboard = void 0;
const overview_service_1 = require("./overview.service");
const catchAsyncHandler_1 = require("../../utils/catchAsyncHandler");
exports.overviewDashboard = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (user.isAdmin) {
        const data = yield (0, overview_service_1.getAdminDashboardOverview)();
        return res.status(200).json({ success: true, role: "admin", data });
    }
    else {
        const data = yield (0, overview_service_1.getUserDashboardOverview)(user.id);
        return res.status(200).json({ success: true, role: "user", data });
    }
}));
