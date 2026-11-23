import { Router } from "express";
import { userSignupSchema } from "./userSchema";
import bcrypt from "bcrypt";
import { db } from "../prisma/db";

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const result = userSignupSchema.safeParse(req.body);
    if (!result.success) {
      const errorMessage = result.error.issues.map((err) => err.message);
      res.status(422).json({
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

router.post("/login", (req, res) => {});

router.get("/me", (req, res) => {});

export default router;
