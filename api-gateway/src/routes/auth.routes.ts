// api-gateway/routes/authRoutes.ts
import express, { Request, Response, Router } from "express";

import { createProxyMiddleware } from "http-proxy-middleware";

const authServiceProxy = createProxyMiddleware<Request, Response>({
  target: "http://localhost:5001",
  changeOrigin: true,
});


// Here we forward the request to Auth Service
const router :Router= express.Router();

router.post("/signup",authServiceProxy)

router.post("/login", authServiceProxy)

router.post("/refresh-token", authServiceProxy);

router.post("/logout",authServiceProxy);

export const authRoutes = router;
