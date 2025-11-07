import { Request, Response, NextFunction } from "express";

export const gatewayErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  
  const status = err?.status || 500;
  const code = err?.code || "GATEWAY_ERROR";
  const message = err?.message || "Something went wrong at API Gateway";

  return res.status(status).json({
    error: { code, message, status,  },
  });
};
