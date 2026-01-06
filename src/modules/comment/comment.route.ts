import express from "express";
import { commentControllers } from "./comment.controller";
import auth, { Role } from "../../middlewares/auth";

const router = express.Router();

router.get("/:id", commentControllers.getCommentById);
router.get("/author/:id", commentControllers.getCommentsByAuthorId);

router.post("/", auth(Role.ADMIN, Role.USER), commentControllers.createComment);

router.patch(
  "/:id",
  auth(Role.ADMIN, Role.USER),
  commentControllers.updateComment
);

router.delete(
  "/:id",
  auth(Role.ADMIN, Role.USER),
  commentControllers.deleteComment
);

export const commentRouter = router;
