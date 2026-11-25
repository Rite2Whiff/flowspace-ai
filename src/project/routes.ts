import { Router } from "express";
import { authMiddleware } from "../user/authMiddleware";
import { db } from "../prisma/db";
import { verifyWorkSpaceOwner } from "../workspace/verifyWorkSpaceOwner";

const router = Router({ mergeParams: true });

router.post(
  "/project",
  authMiddleware,
  verifyWorkSpaceOwner,
  async (req, res) => {
    try {
      const title = req.body.title;
      const createProject = await db.orm.public.Project.create({ title });
      return res
        .status(200)
        .json({ message: "Project successfully created", data: createProject });
    } catch (error) {
      console.log(error);
    }
  },
);

router.put(
  "/project/:projectId",
  authMiddleware,
  verifyWorkSpaceOwner,
  async (req, res) => {
    try {
      const workSpaceId = req.params.workSpaceId?.toString();
      const projectId = req.params.projectId?.toString()!;
      const title = req.body.title;

      const updateProject = await db.orm.public.Project.where({
        id: projectId,
        workSpaceId,
      }).update({ title });

      if (!updateProject) {
        return res.status(404).json({
          message: "The following project is not a part of this workspace",
        });
      }
      return res.status(200).json({
        message: "Project was updated successfully",
        data: updateProject,
      });
    } catch (error) {
      console.log(error);
    }
  },
);

export default router;
