import express from "express";
import cors from "cors";
import userRouter from "./routers/userRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRouter);
app.get("/", async (req, res) => {
    return res.send({ message: "teste" });
});

export default app;
