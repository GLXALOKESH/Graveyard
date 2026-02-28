import { Request, Response, NextFunction } from "express";
import { AccountScanService } from "../../services/AccountScanService.js";
import { AwsAccountRepository } from "../../repositories/AwsAccountRepository.js";
import { AwsRegionRepository } from "../../repositories/AwsRegionRepository.js";
import { AwsInstanceRepository } from "../../repositories/AwsInstanceRepository.js";
import { AwsVolumeRepository } from "../../repositories/AwsVolumeRepository.js";
import { ResponseDTO } from "../../DTOClasses/response.DTO.js";
import { AccountSummaryDTO } from "../../DTOClasses/AccountSummary.DTO.js";

const accountRepository = new AwsAccountRepository();
const regionRepository = new AwsRegionRepository();
const instanceRepository = new AwsInstanceRepository();
const volumeRepository = new AwsVolumeRepository();

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
