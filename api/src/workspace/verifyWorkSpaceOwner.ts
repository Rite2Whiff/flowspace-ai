import type { NextFunction, Request, Response } from "express";
import { db } from "../prisma/db";

export async function verifyWorkSpaceOwner(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.userId;
  const workspaceId = req.params.workSpaceId?.toString();
  const findWorkSpaceOwner = await db.orm.public.Workspace.where({
    id: workspaceId,
    userId,
  }).first();
  if (!findWorkSpaceOwner) {
    console.log("workspace not found");
    return res.status(404).json({ message: "You do not own this workspace" });
  }
  next();
}
