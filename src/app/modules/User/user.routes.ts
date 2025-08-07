import { Router } from "express"
import { userController } from "./user.controller"

const router = Router()


router.get("/",   userController.getAllUsers)
router.get("/:id", userController.getUserById)
router.put("/:id", userController.updateUser)



export const userRoutes= router
