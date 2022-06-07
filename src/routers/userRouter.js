import { Router } from "express";
import {
    signUpValidation,
    signInValidation,
} from "../middlewares/validation.js";
import UserController from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/signup", signUpValidation, UserController.createUser);
userRouter.post("/signin", signInValidation, UserController.signIn);

export default userRouter;
