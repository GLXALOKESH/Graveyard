import { Request, Response, NextFunction } from "express";
import { AccountScanService } from "../../services/AccountScanService.js";
import { RepositoryFactory } from "../../configs/repositoryFactory.js";
import { ResponseDTO } from "../../DTOClasses/response.DTO.js";
import { AccountSummaryDTO } from "../../DTOClasses/AccountSummary.DTO.js";

// Get repositories from factory (switches between AWS and Mock based on USE_MOCK env var)
const accountRepository = RepositoryFactory.getAccountRepository();
const regionRepository = RepositoryFactory.getRegionRepository();
const instanceRepository = RepositoryFactory.getInstanceRepository();
const volumeRepository = RepositoryFactory.getVolumeRepository();

const accountScanService = new AccountScanService(
  accountRepository,
  regionRepository,
  instanceRepository,
  volumeRepository
);

export const getAccountSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
