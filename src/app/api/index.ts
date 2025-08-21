import type { Application } from "express"
import { authRoutes } from "../modules/Auth/auth.route"

import { paymentRoutes } from "../modules/Payment/payment.route"

import { userRoutes } from "../modules/User/user.route"

import { courseRoutes } from "../modules/Course/course.route"
import { lessonRoutes } from "../modules/Lession/lession.route"
import { categoryRoutes } from "../modules/Category/category.route"
import { enrollmentRoutes } from "../modules/Enrollment/enrollment.route"
import { dashboardRoute } from "../modules/Dashboard/overview.route"

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


]

export const initialRoute = (app: Application) => {
  moduleRoutes.forEach((route) => app.use(route.path, route.route))
}
