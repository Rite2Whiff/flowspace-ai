import { Router } from "express";
import { userLoginSchema, userSignupSchema } from "./schema";
import bcrypt from "bcrypt";
import { db } from "../prisma/db";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./authMiddleware";
const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const result = userSignupSchema.safeParse(req.body);
    if (!result.success) {
      const errorMessage = result.error.issues.map((err) => err.message);
      return res.status(422).json({
        message: "Validation failed",
        details: errorMessage[0],
      });
    } else {
      const hashedPassword = await bcrypt.hash(result.data.password, 3);

      await db.orm.public.User.create({
        email: result.data.email,
        username: result.data.username,
        password: hashedPassword,
      });
      res.status(200).json({
        message: "You have successfully signed up",
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = userLoginSchema.safeParse(req.body);
    if (!result.success) {
      const errorMessage = result.error.issues.map((err) => err.message);
      return res.status(422).json({
        message: "Validation failed",
        details: errorMessage[0],
      });
    } else {
      const findUser = await db.orm.public.User.whereUnique({
        username: result.data.username,
      }).first();
      if (!findUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const verifyPassword = bcrypt.compare(
        result.data.password,
        findUser.password,
      );
      if (!verifyPassword) {
        return res.status(401).json({
          message: "Incorrect password",
        });
      }
      const token = jwt.sign(
        {
          userId: findUser.id,
          username: findUser.username,
        },
        process.env.JWT_USER!,
      );
      res.status(200).json({
        message: "You have successfully logged in",
        token,
        user: {
          id: findUser.id,
          email: findUser.email,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const findUser = await db.orm.public.User.whereUnique({ id: userId }).first();
  if (!findUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  return res.status(200).json({
    user: {
      id: findUser.id,
      username: findUser.username,
      email: findUser.email,
    },
  });
});

export default router;
