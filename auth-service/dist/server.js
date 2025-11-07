"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const _1 = __importDefault(require("."));
async function server() {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(config_1.envVariable.MONGO_URI);
        console.log("🛢 Database connected");
        // Start Express app directly (no Socket.IO)
        _1.default.listen(config_1.envVariable.PORT, () => {
            console.log(`🚀 Auth service listening on port ${config_1.envVariable.PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to connect to database", error);
        process.exit(1);
    }
}
server();
//# sourceMappingURL=server.js.map