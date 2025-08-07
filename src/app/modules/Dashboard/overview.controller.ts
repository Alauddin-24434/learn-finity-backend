import { NextFunction, Request, Response } from "express";
import { catchAsyncHandler } from "../../utils/catchAsyncHandler";
import { getDashboardOverview } from "./overview.service";

export const dashboardOverviewController = catchAsyncHandler(async (
    req: Request,
    res: Response,
  
) => {

    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const overview = await getDashboardOverview({ id: req.user.id, role: req.user.role });

    res.status(200).json({ success: true, data: overview });

})