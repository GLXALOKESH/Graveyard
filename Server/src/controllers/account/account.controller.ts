import { Request, Response, NextFunction } from "express";
import { AccountScanService } from "../../services/AccountScanService.js";
import { DynamicRepositoryFactory } from "../../configs/dynamicRepositoryFactory.js";
import { ResponseDTO } from "../../DTOClasses/response.DTO.js";
import { AccountSummaryDTO } from "../../DTOClasses/AccountSummary.DTO.js";

export const getAccountSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountType, credentials, region } = req.body;

    // Create repositories dynamically based on request
    const repos = DynamicRepositoryFactory.createRepositories(
      accountType,
      credentials,
      region
    );

    const accountScanService = new AccountScanService(
      repos.accountRepository,
      repos.regionRepository,
      repos.instanceRepository,
      repos.volumeRepository
    );

    const summary = await accountScanService.scanAccount();

    const response = new ResponseDTO<AccountSummaryDTO>();
    response.setStatus(true);
    response.setMessage("Account summary retrieved successfully");
    response.setData(summary);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
