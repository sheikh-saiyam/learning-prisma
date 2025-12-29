import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { auth } from "./lib/auth";
import { postRouter } from "./modules/post/post.route";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_ORIGIN,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/post", postRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Prisma Blog App Server Is Running!");
});

export default app;
