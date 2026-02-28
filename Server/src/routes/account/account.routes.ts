import { Router } from "express";
import { AccountRoutes } from "../../configs/routes/account.js";
import { validateDto } from "../../middlewares/validateDTOs.js";
import { AccountScanRequestDTO } from "../../DTOClasses/AccountScanRequest.DTO.js";
import { getAccountSummary } from "../../controllers/account/account.controller.js";

const accountRouter = Router();

// POST instead of GET to accept credentials in body
accountRouter.post(AccountRoutes.SUMMARY, validateDto(AccountScanRequestDTO, "body"), getAccountSummary);

export default accountRouter;
