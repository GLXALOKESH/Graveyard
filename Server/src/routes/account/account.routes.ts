import { Router } from "express";
import { AccountRoutes } from "../../configs/routes/account.js";
import { validateDto } from "../../middlewares/validateDTOs.js";
import { AccountScanRequestDTO } from "../../DTOClasses/AccountScanRequest.DTO.js";
import { getAccountSummary } from "../../controllers/account/account.controller.js";
import { getAccountOverview } from "../../controllers/overview/overview.controller.js";

const accountRouter = Router();

// POST instead of GET to accept credentials in body
accountRouter.post(AccountRoutes.SUMMARY, validateDto(AccountScanRequestDTO, "body"), getAccountSummary);
accountRouter.post(AccountRoutes.OVERVIEW, validateDto(AccountScanRequestDTO, "body"), getAccountOverview);

export default accountRouter;
