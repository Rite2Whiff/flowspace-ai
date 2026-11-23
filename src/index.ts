import express from "express";
import userRouter from "./user/routes";

const app = express();

app.use(express.json());

app.use("/app/v1/user", userRouter);

app.listen(3000, () => {
  console.log("Your app is up and successfully running on port 3000");
});
