import { Router } from "express";
import { AccountRoutes } from "../../configs/routes/account.js";
import { getAccountSummary } from "../../controllers/account/account.controller.js";

const accountRouter = Router();

accountRouter.get(AccountRoutes.SUMMARY, getAccountSummary);

export default accountRouter;
