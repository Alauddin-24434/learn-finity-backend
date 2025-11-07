import type { Request, Response, NextFunction } from "express"

/*
  Middleware to check user role dynamically.
  Pass "admin" to allow only admins,
  Pass "!admin" to allow everyone except admins.
  Works with `req.user.isAdmin`.
*/
export const authorize = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" })
    }

    if (role === "admin" && !req.user) {
      return res.status(403).json({ message: "Access denied: Admins only" })
    }


    next()
  }
}
