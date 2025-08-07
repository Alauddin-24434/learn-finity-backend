import { prisma } from "../../lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import {
  Admission,
  AdmissionTrendItem,
  DashboardData,
  DashboardStats,
  DepartmentWise,
  FacultyWise,
} from "./overview.interfcae";

function generateAdmissionTrend(admissions: Admission[]): AdmissionTrendItem[] {
  const sorted = [...admissions].sort((a, b) => a.session.localeCompare(b.session));
  return sorted.map((current, index) => {
    if (index === 0) {
      return {
        ...current,
        differenceFromPrevious: null,
        status: "neutral",
      };
    }
    const prev = sorted[index - 1];
    const diff = current.studentCount - prev.studentCount;
    return {
      ...current,
      differenceFromPrevious: diff,
      status: diff === 0 ? "neutral" : diff > 0 ? "up" : "down",
    };
  });
}

export async function getDashboardOverview(user: { id: string; role: string }): Promise<DashboardData> {
  const role = user.role;

  if (role === "SUPER_ADMIN") {
    const totalStudents = await prisma.student.count();
    const totalStaff = await prisma.staff.count();
    const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });

    // Aggregate sum of payments amount
    const totalPaymentsAgg = await prisma.payment.aggregate({
      _sum: { amount: true },
    });
    // Convert Prisma Decimal to number safely
    const totalPaymentsDecimal = totalPaymentsAgg._sum.amount;
    const totalPayments: number = totalPaymentsDecimal ? (totalPaymentsDecimal as Decimal).toNumber() : 0;

    // Session wise student count grouped by sessionId
    const sessionWiseRaw = await prisma.student.groupBy({
      by: ["sessionId"],
      _count: { _all: true },
    });

    // Fetch sessions names for mapping sessionId -> session name
    const sessionIds = sessionWiseRaw.map((s) => s.sessionId);
    const sessions = await prisma.academicSession.findMany({
      where: { id: { in: sessionIds } },
      select: { id: true, name: true },
    });

    const sessionMap = new Map(sessions.map((s) => [s.id, s.name]));
    const sessionWiseAdmissions: Admission[] = sessionWiseRaw.map((item) => ({
      session: sessionMap.get(item.sessionId) ?? "Unknown",
      studentCount: item._count._all,
    }));

    // Admission trend calculation
    const admissionTrend = generateAdmissionTrend(sessionWiseAdmissions);

    // Department wise student count grouped by departmentId
    const departmentWiseRaw = await prisma.student.groupBy({
      by: ["departmentId"],
      _count: { _all: true },
    });
    const departmentIds = departmentWiseRaw.map((d) => d.departmentId);
    const departments = await prisma.department.findMany({
      where: { id: { in: departmentIds } },
      select: { id: true, name: true },
    });
    const departmentMap = new Map(departments.map((d) => [d.id, d.name]));
    const departmentWise: DepartmentWise[] = departmentWiseRaw.map((item) => ({
      department: departmentMap.get(item.departmentId) ?? "Unknown",
      studentCount: item._count._all,
    }));

    // Faculty wise student count grouped by facultyId
    const facultyWiseRaw = await prisma.student.groupBy({
      by: ["facultyId"],
      _count: { _all: true },
    });
    // Filter out nulls for facultyId before fetching
    const facultyIds = facultyWiseRaw
      .map((f) => f.facultyId)
      .filter((id): id is string => id !== null);
    const faculties = await prisma.faculty.findMany({
      where: { id: { in: facultyIds } },
      select: { id: true, name: true },
    });
    const facultyMap = new Map(faculties.map((f) => [f.id, f.name]));
    const facultyWise: FacultyWise[] = facultyWiseRaw
      .filter((item) => item.facultyId !== null)
      .map((item) => ({
        faculty: facultyMap.get(item.facultyId!) ?? "Unknown",
        studentCount: item._count._all,
      }));

    const stats: DashboardStats = {
      totalStudents,
      totalStaff,
      totalAdmins,
      totalPayments,
    };

    return {
      role,
      stats,
      sessionWiseAdmissions,
      admissionTrend,
      departmentWise,
      facultyWise,
    };
  }

  if (role === "ADMIN") {
    // TODO: Implement admin-specific overview logic as needed
    return {
      role,
      stats: {
        myDepartmentStudents: 125,
        myFacultyStudents: 350,
        totalStudents: 0,
        totalStaff: 0,
        totalAdmins: 0,
        totalPayments: 0,
      } as any,
      message: "Admin overview data",
    };
  }

  if (role === "STUDENT") {
    return {
      role,
      profile: {
        studentId: user.id,
        name: "Student Name",
        session: "2023-24",
        department: "CSE",
        status: "APPROVED",
      },
      message: "Student dashboard data",
    };
  }

  if (role === "GUEST") {
    return {
      role,
      message: "Guest access limited. Please register or login.",
    };
  }

  return {
    role,
    message: "No data available for your role.",
  };
}
