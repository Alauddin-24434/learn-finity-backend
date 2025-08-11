import { Router } from "express"
import { userController } from "./user.controller"
import { authenticate } from "../../middleware/authenticate"

const router = Router()


router.get("/",   userController.getAllUsers)

router.get("/me", authenticate, userController.getMeById)
router.put("/:id", userController.updateUser)



export const userRoutes= router
