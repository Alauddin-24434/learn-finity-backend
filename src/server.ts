import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { notFound } from "./app/middleware/notFound"
import { initialRoute } from "./app/api"
import { envVariable } from "./app/config"
import globalErrorHandler from "./app/middleware/globalErrorHandler"
import { setupSwagger } from "./app/config/swagger"

const app = express()
const PORT = envVariable.PORT || 5000
// const clientURL = envVariable.CLIENT_URL || "http://localhost:3000"

/**
 * ✅ Middleware Setup (Ordered by priority)
 */

// 🍪 1️⃣ Cookie-parser
app.use(cookieParser())

// 🛡️ 2️⃣ Helmet - Security headers
app.use(helmet())

// 🌍 3️⃣ CORS
app.use(
  cors({
    origin: ["http://localhost:3000","https://elearning-platform-phi.vercel.app"],
    credentials: true,
  }),
)

// 📋 4️⃣ Morgan - Request logging
const customFormat = ":method :url :status - :res[content-length] bytes - :response-time ms - :user-agent"
app.use(morgan(customFormat))

// 📦 5️⃣ Body Parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// 📖 Swagger Docs
setupSwagger(app);
/**
 * 🔄 Routes
 */
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Elearning platform is running!" })
})


// API entry
initialRoute(app)

// ❌ Not Found
app.use(notFound)

// ⚠️ Global Error Handler
app.use(globalErrorHandler)

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Akademi Backend running on port ${PORT}`)
})

export default app
