"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String },
    role: {
        type: [String],
        enum: ["student", "instructor", "admin"], // Roles can be multiple
        default: ["student"], // Default to student role
        required: true,
    },
    courseEnrollments: { type: [String], default: [] },
}, { timestamps: true, versionKey: false });
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
//# sourceMappingURL=auth.model.js.map