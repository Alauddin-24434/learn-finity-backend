
import { subMonths, startOfMonth, endOfMonth } from "date-fns";

import { prisma } from "../../lib/prisma";

// ------------------
// Admin Dashboard Analytics
// ------------------
export const getAdminDashboardOverview = async () => {
  const totalUsers = await prisma.user.count({ where: { isDeleted: false } });
  const totalCourses = await prisma.course.count({ where: { isDeleted: false } });
  const totalEnrollments = await prisma.enrollment.count({ where: { isDeleted: false } });

  const payments = await prisma.payment.findMany({
    where: { isDeleted: false },
    select: { amount: true, status: true },
  });

  const totalPayments = payments.length;
  const totalRevenue = payments.filter((p) => p.status === "PAID").reduce((acc, curr) => acc + curr.amount, 0);

  // Monthly Revenue & Payments (last 6 months)
  const today = new Date();
  const monthlyStats: { month: string; revenue: number; payments: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = startOfMonth(subMonths(today, i));
    const end = endOfMonth(subMonths(today, i));

    const monthPayments = await prisma.payment.findMany({
      where: { status: "PAID", paidAt: { gte: start, lte: end }, isDeleted: false },
      select: { amount: true },
    });

    monthlyStats.push({
      month: start.toLocaleString("default", { month: "short", year: "numeric" }),
      revenue: monthPayments.reduce((acc, curr) => acc + curr.amount, 0),
      payments: monthPayments.length,
    });
  }

  // Top 5 Courses by Enrollment
  const enrollmentsPerCourse = await prisma.course.findMany({
    where: { isDeleted: false },
    select: { id: true, title: true, enrollments: { where: { isDeleted: false }, select: { id: true } } },
  });

  const topCourses = enrollmentsPerCourse
    .map((c) => ({ courseId: c.id, title: c.title, enrollmentsCount: c.enrollments.length }))
    .sort((a, b) => b.enrollmentsCount - a.enrollmentsCount)
    .slice(0, 5);

  // User Growth last 6 months
  const userGrowth: { month: string; newUsers: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = startOfMonth(subMonths(today, i));
    const end = endOfMonth(subMonths(today, i));
    const newUsers = await prisma.user.count({ where: { createdAt: { gte: start, lte: end }, isDeleted: false } });
    userGrowth.push({ month: start.toLocaleString("default", { month: "short", year: "numeric" }), newUsers });
  }

  return { totalUsers, totalCourses, totalEnrollments, totalPayments, totalRevenue, monthlyStats, topCourses, userGrowth };
};

// ------------------
// User Dashboard Analytics
// ------------------
export const getUserDashboardOverview = async (userId: string) => {
  // Enrolled Courses
  const enrolledCourses = await prisma.enrollment.findMany({
    where: { userId, isDeleted: false },
    include: { course: true },
  });

  // Lesson Progress
  const lessonProgress = await prisma.lessonProgress.findMany({
    where: { userId, completed: true },
    include: { lesson: true },
  });

  // Payments
  const payments = await prisma.payment.findMany({
    where: { userId, isDeleted: false, status: "PAID" },
  });

  // Lesson Completion per Course
  const progressPerCourse: { courseId: string; title: string; completedLessons: number; totalLessons: number }[] = [];
  for (let enrollment of enrolledCourses) {
    const totalLessons = await prisma.lesson.count({ where: { courseId: enrollment.courseId, isDeleted: false } });
    const completedLessons = lessonProgress.filter((lp) => lp.courseId === enrollment.courseId).length;

    progressPerCourse.push({
      courseId: enrollment.courseId,
      title: enrollment.course.title,
      completedLessons,
      totalLessons,
    });
  }

  // Monthly Progress (Lessons completed per month, last 6 months)
  const today = new Date();
  const monthlyProgress: { month: string; completedLessons: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = startOfMonth(subMonths(today, i));
    const end = endOfMonth(subMonths(today, i));

    const completed = await prisma.lessonProgress.count({
      where: { userId, completed: true },
    });

    monthlyProgress.push({
      month: start.toLocaleString("default", { month: "short", year: "numeric" }),
      completedLessons: completed,
    });
  }

  return {
    enrolledCoursesCount: enrolledCourses.length,
    completedLessonsCount: lessonProgress.length,
    totalPayments: payments.length,
    totalSpent: payments.reduce((acc, curr) => acc + curr.amount, 0),
    progressPerCourse,
    monthlyProgress,
  };
};
