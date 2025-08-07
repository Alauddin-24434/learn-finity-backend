// User interface (brief)
export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "ADMIN" | "STUDENT" | "GUEST" |"STAFF";
  fullName: string;
  isActive: boolean;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  
}
