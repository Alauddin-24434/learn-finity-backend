import type { Application } from "express"
import { authRoutes } from "../modules/Auth/auth.route"

import { paymentRoutes } from "../modules/Payment/payment.route"

import { userRoutes } from "../modules/User/user.routes"

import { dashboardRoutes } from "../modules/Dashboard/overview.route"
import { courseRoutes } from "../modules/Course/course.routes"
import { lessonRoutes } from "../modules/Lession/lession.route"
import { categoryRoutes } from "../modules/Category/category.route"
import { enrollmentRoutes } from "../modules/Enrollment/enrollment.route"
import { couponRoutes } from "../modules/Coupon/coupon.route"
import { useCouponRoutes } from "../modules/CouponUsage/couponUsage.route"

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
    path: "/api/lessions",
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
    path: "/api/coupons",
    route: couponRoutes,
  },
  {
    path: "/api/usecoupons",
    route: useCouponRoutes,
  },
  {
    path: "/api/dashboards",
    route: dashboardRoutes,
  },

  {
    path: "/api/payments",
    route: paymentRoutes,
  },


]

export const initialRoute = (app: Application) => {
  moduleRoutes.forEach((route) => app.use(route.path, route.route))
}
