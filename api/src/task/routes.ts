import { Router } from "express";
import { authMiddleware } from "../user/authMiddleware";
import { verifyWorkSpaceOwner } from "../workspace/verifyWorkSpaceOwner";
import { veryifyProjectOwner } from "../project/verifyProjectOwner";
import { db } from "../prisma/db";

const router = Router({ mergeParams: true });

router.post(
  "/task",
  authMiddleware,
  verifyWorkSpaceOwner,
  veryifyProjectOwner,
  async (req, res) => {
    try {
      const title = req.body.title;
      const projectId = req.params.projectId?.toString();
      const task = await db.orm.public.Task.create({ title, projectId });
      return res
        .status(200)
        .json({ message: "Task created successfully", task });
    } catch (error) {
      console.log(error);
    }
  },
);

router.get(
  "/tasks",
  authMiddleware,
  verifyWorkSpaceOwner,
  veryifyProjectOwner,
  async (req, res) => {
    try {
      const projectId = req.params.projectId?.toString();
      const tasks = await db.orm.public.Task.where({ projectId }).all();
      if (!tasks) {
        return res.status(404).json({ message: "No task found" });
      }
      return res.status(200).json({ tasks });
    } catch (error) {
      console.log(error);
    }
  },
);

router.put(
  "/tasks/:taskId",
  authMiddleware,
  verifyWorkSpaceOwner,
  veryifyProjectOwner,
  async (req, res) => {
    try {
      const taskId = req.params.taskId?.toString();
      const title = req.body.title;
      const updateTask = await db.orm.public.Task.where({ id: taskId }).update({
        title,
      });
      if (!updateTask) {
        return res.status(404).json({ message: "No task found" });
      }
      return res
        .status(200)
        .json({ message: "Task was successfully updated", updateTask });
    } catch (error) {
      console.log("error");
    }
  },
);

export default router;
