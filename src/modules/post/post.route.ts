import express from "express";
import { postControllers } from "./post.controller";

const router = express.Router();

router.get("/", postControllers.getPosts);
router.post("/", postControllers.createPost);

export const postRouter = router;
