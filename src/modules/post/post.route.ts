import express from "express";
import { postControllers } from "./post.controller";
import auth, { Role } from "../../middlewares/auth";

const router = express.Router();

router.get("/", postControllers.getPosts);

router.get(
  "/my-posts",
  auth(Role.USER, Role.ADMIN),
  postControllers.getMyPosts
);

router.get("/:id", postControllers.getPostById);

router.post("/", auth(Role.USER, Role.ADMIN), postControllers.createPost);

router.post(
  "/create-many",
  auth(Role.USER, Role.ADMIN),
  postControllers.createManyPosts
);

export const postRouter = router;
