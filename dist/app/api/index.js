"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialRoute = void 0;
const auth_route_1 = require("../modules/Auth/auth.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const user_routes_1 = require("../modules/User/user.routes");
const course_routes_1 = require("../modules/Course/course.routes");
const lession_route_1 = require("../modules/Lession/lession.route");
const category_route_1 = require("../modules/Category/category.route");
const enrollment_route_1 = require("../modules/Enrollment/enrollment.route");
const overview_route_1 = require("../modules/Dashboard/overview.route");
const moduleRoutes = [
    {
        path: "/api/auth",
        route: auth_route_1.authRoutes,
    },
    {
        path: "/api/users",
        route: user_routes_1.userRoutes,
    },
    {
        path: "/api/courses",
        route: course_routes_1.courseRoutes,
    },
    {
        path: "/api/lessons",
        route: lession_route_1.lessonRoutes,
    },
    {
        path: "/api/categories",
        route: category_route_1.categoryRoutes,
    },
    {
        path: "/api/enrollments",
        route: enrollment_route_1.enrollmentRoutes,
    },
    {
        path: "/api/payments",
        route: payment_route_1.paymentRoutes,
    },
    {
        path: "/api/overviews",
        route: overview_route_1.dashboardRoute,
    },
];
const initialRoute = (app) => {
    moduleRoutes.forEach((route) => app.use(route.path, route.route));
};
exports.initialRoute = initialRoute;
