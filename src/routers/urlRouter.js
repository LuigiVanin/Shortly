import { Router } from "express";
import UrlController from "../controllers/urlController.js";
import { requestValidation } from "../middlewares/validation.js";
import { postUrlSchema } from "../helpers/schemas.js";
import authentication from "../middlewares/auth.js";

const urlRouter = Router();

urlRouter.post(
    "/shorten",
    authentication,
    requestValidation(postUrlSchema),
    UrlController.createShortUrl
);
urlRouter.get("/open/:shortUrl", UrlController.openShortUrl);
urlRouter.get("/:id", UrlController.getShortUrlById);

export default urlRouter;
