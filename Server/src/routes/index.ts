import { Router, Request, Response } from "express";
import { WellcomeRoutes } from "../configs/routes/wellcome.js";
import { AccountRoutes } from "../configs/routes/account.js";
import { MockRoutes } from "../configs/routes/mock.js";
import wellcomeRoutes from "./hello/wellcome.js";
import accountRoutes from "./account/account.routes.js";
import mockRoutes from "./mock/mock.routes.js";

const mainRouter = Router();

mainRouter.get("/", (req: Request, res: Response): void => {
  res.send("API is running... Go to /hello/wellcome to see the wellcome message.");
});

mainRouter.use(WellcomeRoutes.BASE_PATH, wellcomeRoutes);
mainRouter.use(AccountRoutes.BASE_PATH, accountRoutes);
mainRouter.use(MockRoutes.BASE_PATH, mockRoutes);

export default mainRouter;

