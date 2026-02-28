import { Router, Request, Response } from "express";
import { WellcomeRoutes } from "../configs/routes/wellcome.js";
import { AccountRoutes } from "../configs/routes/account.js";
import { OverviewRoutes } from "../configs/routes/overview.js";
import wellcomeRoutes from "./hello/wellcome.js";
import accountRoutes from "./account/account.routes.js";
import overviewRoutes from "./overview/overview.routes.js";

const mainRouter = Router();

mainRouter.get("/", (req: Request, res: Response): void => {
  res.send("API is running... Go to /hello/wellcome to see the wellcome message.");
});

mainRouter.use(WellcomeRoutes.BASE_PATH, wellcomeRoutes);
mainRouter.use(AccountRoutes.BASE_PATH, accountRoutes);
mainRouter.use(OverviewRoutes.BASE_PATH, overviewRoutes);

export default mainRouter;

