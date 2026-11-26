import type { NextFunction, Request, Response } from "express";
import { db } from "../prisma/db";

export async function veryifyProjectOwner(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const projectId = req.params.projectId?.toString();
  const findProjectOwner = await db.orm.public.Project.where({
    id: projectId,
  }).first();
  if (!findProjectOwner) {
    return res.status(404).json({ message: "Project not found" });
  }

  next();
}
