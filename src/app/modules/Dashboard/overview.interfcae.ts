export interface Admission {
  session: string; // session name, e.g. "2023-24"
  studentCount: number;
}

export interface DepartmentWise {
  department: string; // department name
  studentCount: number;
}

export interface FacultyWise {
  faculty: string; // faculty name
  studentCount: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  totalAdmins: number;
  totalPayments: number;
}

export interface AdmissionTrendItem extends Admission {
  differenceFromPrevious: number | null;
  status: "up" | "down" | "neutral";
}

export interface DashboardData {
  role: "SUPER_ADMIN" | "ADMIN" | "STUDENT" | "GUEST" | string;
  stats?: DashboardStats;
  sessionWiseAdmissions?: Admission[];
  admissionTrend?: AdmissionTrendItem[];
  departmentWise?: DepartmentWise[];
  facultyWise?: FacultyWise[];
  profile?: any; // customize for student profile
  message?: string;
}
