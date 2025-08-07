import type { Request, Response, NextFunction } from "express"

export const authorize =
  (isAdmin: boolean) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ message: "Forbidden: No user found" })
    }

    if (isAdmin && !req.user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin access only" })
    }

    next()
  }
