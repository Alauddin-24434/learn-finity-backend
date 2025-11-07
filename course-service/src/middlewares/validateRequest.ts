import type { Request, Response, NextFunction } from "express"
import { catchAsyncHandler } from "../utils/catchAsync"

export const validateRequest = (schema:any) => {
  return catchAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    next()
  })
}
