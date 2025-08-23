import { subMonths, startOfMonth, endOfMonth } from "date-fns"
import { prisma } from "../lib/prisma"

/**
 * @desc Fetches admin dashboard analytics including users, courses, enrollments, payments, revenue, top courses and user growth
 * @returns Object containing:
 * - totalUsers: number
 * - totalCourses: number
 * - totalEnrollments: number
 * - totalPayments: number
 * - totalRevenue: number
 * - monthlyStats: Array<{ month: string, revenue: number, payments: number }>
 * - topCourses: Array<{ courseId: string, title: string, enrollmentsCount: number }>
 * - userGrowth: Array<{ month: string, newUsers: number }>
 */
export const getAdminDashboardOverview = async () => {
  // Total counts
  const totalUsers = await prisma.user.count({ where: { isDeleted: false } })
  const totalCourses = await prisma.course.count({ where: { isDeleted: false } })
  const totalEnrollments = await prisma.enrollment.count({ where: { isDeleted: false } })

  // Payments & Revenue
  const payments = await prisma.payment.findMany({
    where: { isDeleted: false },
    select: { amount: true, status: true },
  })
  const totalPayments = payments.length
  const totalRevenue = payments
    .filter((p) => p.status === "PAID")
    .reduce((acc, curr) => acc + curr.amount, 0)

  // Last 6 months stats
  const today = new Date()
  const monthlyStats: { month: string; revenue: number; payments: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const start = startOfMonth(subMonths(today, i))
    const end = endOfMonth(subMonths(today, i))

    const monthPayments = await prisma.payment.findMany({
      where: { status: "PAID", paidAt: { gte: start, lte: end }, isDeleted: false },
      select: { amount: true },
    })

    monthlyStats.push({
      month: start.toLocaleString("default", { month: "short", year: "numeric" }),
      revenue: monthPayments.reduce((acc, curr) => acc + curr.amount, 0),
      payments: monthPayments.length,
    })
  }

  // Top 5 courses by enrollments
  const enrollmentsPerCourse = await prisma.course.findMany({
    where: { isDeleted: false },
    select: { id: true, title: true, enrollments: { where: { isDeleted: false }, select: { id: true } } },
  })

  const topCourses = enrollmentsPerCourse
    .map((c) => ({ courseId: c.id, title: c.title, enrollmentsCount: c.enrollments.length }))
    .sort((a, b) => b.enrollmentsCount - a.enrollmentsCount)
    .slice(0, 5)

  // User growth last 6 months
  const userGrowth: { month: string; newUsers: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const start = startOfMonth(subMonths(today, i))
    const end = endOfMonth(subMonths(today, i))
    const newUsers = await prisma.user.count({ where: { createdAt: { gte: start, lte: end }, isDeleted: false } })
    userGrowth.push({ month: start.toLocaleString("default", { month: "short", year: "numeric" }), newUsers })
  }

  return { totalUsers, totalCourses, totalEnrollments, totalPayments, totalRevenue, monthlyStats, topCourses, userGrowth }
}

/**
 * @desc Fetches user dashboard analytics including enrolled courses, payments, created courses, and revenue breakdown
 * @param userId - User ID for whom dashboard is fetched
 * @returns Object containing:
 * - enrolledCoursesCount: number
 * - totalSpent: number
 * - createdCoursesCount: number
 * - enrollmentsPerCourse: Array<{ courseId: string, title: string, enrollments: number, revenue: number }>
 * - totalRevenue: number
 * - weeklyRevenue: number
 * - monthlyRevenue: number
 * - yearlyRevenue: number
 */
export const getUserDashboardOverview = async (userId: string) => {
  // --------- STUDENT DATA ----------
  const enrolledCourses = await prisma.enrollment.findMany({
    where: { userId, isDeleted: false },
    include: { course: true },
  })

  const studentPayments = await prisma.payment.findMany({
    where: { userId, isDeleted: false, status: "PAID" },
  })

  // --------- CREATOR DATA ----------
  const createdCourses = await prisma.course.findMany({
    where: { authorId: userId, isDeleted: false },
    include: { enrollments: true, payments: true },
  })

  const enrollmentsPerCourse = createdCourses.map((course) => ({
    courseId: course.id,
    title: course.title,
    enrollments: course.enrollments.length,
    revenue: course.payments
      .filter((p) => p.status === "PAID")
      .reduce((acc, p) => acc + p.amount, 0),
  }))

  const totalRevenue = enrollmentsPerCourse.reduce((acc, c) => acc + c.revenue, 0)

  // Weekly / Monthly / Yearly Revenue
  const today = new Date()
  const weeklyRevenue = createdCourses.reduce((acc, course) => {
    const weeklyPayments = course.payments.filter(
      (p) => p.status === "PAID" && new Date(p.paidAt) >= new Date(today.setDate(today.getDate() - 7))
    )
    return acc + weeklyPayments.reduce((sum, p) => sum + p.amount, 0)
  }, 0)

  const monthlyRevenue = createdCourses.reduce((acc, course) => {
    const monthlyPayments = course.payments.filter(
      (p) =>
        p.status === "PAID" &&
        new Date(p.paidAt).getMonth() === today.getMonth() &&
        new Date(p.paidAt).getFullYear() === today.getFullYear()
    )
    return acc + monthlyPayments.reduce((sum, p) => sum + p.amount, 0)
  }, 0)

  const yearlyRevenue = createdCourses.reduce((acc, course) => {
    const yearlyPayments = course.payments.filter(
      (p) => p.status === "PAID" && new Date(p.paidAt).getFullYear() === today.getFullYear()
    )
    return acc + yearlyPayments.reduce((sum, p) => sum + p.amount, 0)
  }, 0)

  return {
    enrolledCoursesCount: enrolledCourses.length,
    totalSpent: studentPayments.reduce((acc, p) => acc + p.amount, 0),

    createdCoursesCount: createdCourses.length,
    enrollmentsPerCourse,
    totalRevenue,
    weeklyRevenue,
    monthlyRevenue,
    yearlyRevenue,
  }
}
