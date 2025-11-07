import { IUser } from "../interfaces/auth.interfaces";
declare const User: import("mongoose").Model<IUser, {}, {}, {}, import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=auth.model.d.ts.map