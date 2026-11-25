import { Router } from "express";
import { authMiddleware } from "../user/authMiddleware";
import { db } from "../prisma/db";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const title = req.body.title;
    const userId = req.userId;
    const workSpace = await db.orm.public.Workspace.create({
      title: title,
      userId,
    });
    return res.status(200).json({
      message: "Your workspace was createed successfully",
      workSpace,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const workSpaces = await db.orm.public.Workspace.where({ userId }).all();
    return res.status(200).json({
      workSpaces,
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id?.toString();
    const userId = req.userId;
    const title = req.body.title;
    const updateCourse = await db.orm.public.Workspace.where({
      id,
      userId,
    }).update({ title });
    if (!updateCourse) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    res
      .status(200)
      .json({ message: "Workspace updated successfully", data: updateCourse });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id?.toString();
    const userId = req.userId;

    const deleteWorkSpace = await db.orm.public.Workspace.where({
      id,
      userId,
    }).delete();
    if (!deleteWorkSpace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }
    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.log(error);
  }
});

export default router;
