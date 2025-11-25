import type { Application } from "express"
import { authRoutes } from "../routes/auth.route"

import { paymentRoutes } from "../routes/payment.route"

import { userRoutes } from "../routes/user.route"

import { courseRoutes } from "../routes/course.route"
import { lessonRoutes } from "../routes/lession.route"
import { categoryRoutes } from "../routes/category.route"
import { enrollmentRoutes } from "../routes/enrollment.route"
import { dashboardRoute } from "../routes/overview.route"
import { reviewRoutes } from "../routes/review.route"

const moduleRoutes = [
  {
    path: "/api/auth",
    route: authRoutes,
  },
  {
    path: "/api/users",
    route: userRoutes,
  },
  {
    path: "/api/courses",
    route: courseRoutes,
  },
  {
    path: "/api/lessons",
    route: lessonRoutes,
  },
  {
    path: "/api/categories",
    route: categoryRoutes,
  },
  {
    path: "/api/enrollments",
    route: enrollmentRoutes,
  },
 

  {
    path: "/api/payments",
    route: paymentRoutes,
  },
  {
    path: "/api/overviews",
    route: dashboardRoute,
  },
 {
    path: "/api/reviews",
    route: reviewRoutes,
  },


]

export const initialRoute = (app: Application) => {
  moduleRoutes.forEach((route) => app.use(route.path, route.route))
}
