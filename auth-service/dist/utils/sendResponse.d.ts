import { Response } from "express";
interface IApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
    };
}
export declare const sendResponse: <T>(res: Response, responseData: IApiResponse<T>) => void;
export {};
//# sourceMappingURL=sendResponse.d.ts.map