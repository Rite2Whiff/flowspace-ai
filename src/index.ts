import express from "express";
import userRouter from "./user/routes";
import workSpaceRouter from "./workspace/routes";
import projectRouter from "./project/routes";
import taskRouter from "./task/routes";

const app = express();

app.use(express.json());

app.use("/app/v1/user", userRouter);
app.use("/app/v1/workspace", workSpaceRouter);
app.use("/app/v1/:workSpaceId/", projectRouter);
app.use("/app/v1/:workspaceId/projects/:projectId", taskRouter);

app.listen(3000, () => {
  console.log("Your app is up and successfully running on port 3000");
});
