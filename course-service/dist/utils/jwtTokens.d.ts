import { type JwtPayload } from "jsonwebtoken";
export declare const createAccessToken: (payload: JwtPayload) => string;
export declare const createRefreshToken: (payload: JwtPayload) => string;
export declare const verifyAccessToken: (token: string) => JwtPayload;
export declare const verifyRefreshToken: (token: string) => JwtPayload;
//# sourceMappingURL=jwtTokens.d.ts.map