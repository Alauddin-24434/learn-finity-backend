// api-gateway/routes/authRoutes.ts
import express, { Request, Response, Router } from "express";

import { createProxyMiddleware } from "http-proxy-middleware";

const url = "http://localhost:5002";

const courseServiceProxy = createProxyMiddleware<Request, Response>({
  target: url,
  changeOrigin: true,
  
});
// Here we forward the request to Auth Service
const router: Router = express.Router();

router.post("/courses", courseServiceProxy);
// POST: Create or fetch categories JSON data
router.post("/courses/categories", courseServiceProxy);



// router.get("/", courseServiceProxy);

export const courseRoutes = router;
