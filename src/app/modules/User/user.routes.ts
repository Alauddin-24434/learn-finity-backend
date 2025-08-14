import { Router } from "express"
import { userController } from "./user.controller"
import { authenticate } from "../../middleware/authenticate"
import { authorize } from "../../middleware/authorize"

const router = Router()


router.get("/",  authenticate, authorize("admin"),  userController.getAllUsers)
router.get("/me", authenticate, userController.getMe)
router.put("/:id", userController.updateUser)



export const userRoutes= router
