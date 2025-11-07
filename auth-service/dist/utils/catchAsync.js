"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsyncHandler = void 0;
const catchAsyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.catchAsyncHandler = catchAsyncHandler;
//# sourceMappingURL=catchAsync.js.map