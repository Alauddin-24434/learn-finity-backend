import {Request, Response } from "express";
import { getAdminDashboardOverview, getUserDashboardOverview } from "./overview.service";
import { catchAsyncHandler } from "../../utils/catchAsyncHandler";
import { AppError } from "../../error/AppError";

export const overviewDashboard = catchAsyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new AppError(404, "User not Found")
  }

  if (user.isAdmin) {
    const data = await getAdminDashboardOverview();
    return res.status(200).json({ success: true, role: "admin", data });
  } else {
    const data = await getUserDashboardOverview(user.id);
    return res.status(200).json({ success: true, role: "user", data });
  }
});
