import express, { Application, Request, Response } from "express";
import { postRouter } from "./modules/post/post.route";

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Prisma Blog App Server Is Running!");
});

app.use("/post", postRouter);

export default app;
