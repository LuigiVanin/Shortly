import { Router } from "express";
import { requestValidation } from "../middlewares/validation.js";
import { signInSchema, signUpSchema } from "../helpers/schemas.js";
import UserController from "../controllers/userController.js";
import authentication from "../middlewares/auth.js";

const userRouter = Router();

userRouter.post(
    "/signup",
    requestValidation(signUpSchema),
    UserController.createUser
);
userRouter.post(
    "/signin",
    requestValidation(signInSchema),
    UserController.signIn
);
userRouter.get("/users/:id", authentication, UserController.getUrlsByUser);

export default userRouter;
