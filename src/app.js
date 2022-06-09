import express from "express";
import cors from "cors";
import userRouter from "./routers/userRouter.js";
import urlRouter from "./routers/urlRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use("/urls/", urlRouter);

app.get("/", async (req, res) => {
    return res.send({ message: "teste" });
});

export default app;
