"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialRoute = void 0;
const auth_route_1 = require("../routes/auth.route");
const payment_route_1 = require("../routes/payment.route");
const user_route_1 = require("../routes/user.route");
const course_route_1 = require("../routes/course.route");
const lession_route_1 = require("../routes/lession.route");
const category_route_1 = require("../routes/category.route");
const enrollment_route_1 = require("../routes/enrollment.route");
const overview_route_1 = require("../routes/overview.route");
const moduleRoutes = [
    {
        path: "/api/auth",
        route: auth_route_1.authRoutes,
    },
    {
        path: "/api/users",
        route: user_route_1.userRoutes,
    },
    {
        path: "/api/courses",
        route: course_route_1.courseRoutes,
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
