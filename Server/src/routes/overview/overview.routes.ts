import { Router } from "express";
import { getOverview } from "../../controllers/overview/overview.controller.js";

const overviewRouter = Router();

overviewRouter.get("/", getOverview);

export default overviewRouter;
