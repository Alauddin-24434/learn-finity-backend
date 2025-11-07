export interface ILoginUser {
    email: string;
    password: string;
}
export interface IRegisterUser {
    name: string;
    email: string;
    password: string;
}
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    avatar?: string;
    role: ("student" | "instructor" | "admin")[];
    courseEnrollments?: string[];
}
//# sourceMappingURL=auth.interfaces.d.ts.map