import { Request, Response, NextFunction } from "express";
import { OverviewService } from "../../services/OverviewService.js";
import { AwsAccountRepository } from "../../repositories/AwsAccountRepository.js";
import { AwsRegionRepository } from "../../repositories/AwsRegionRepository.js";
import { AwsInstanceRepository } from "../../repositories/AwsInstanceRepository.js";
import { AwsRdsRepository } from "../../repositories/AwsRdsRepository.js";
import { AwsEcsRepository } from "../../repositories/AwsEcsRepository.js";
import { AwsLambdaRepository } from "../../repositories/AwsLambdaRepository.js";
import { AwsCloudWatchRepository } from "../../repositories/AwsCloudWatchRepository.js";
import { ZombieScoringService } from "../../services/ZombieScoringService.js";
import { redisClient } from "../../configs/redisClient.js";
import { ResponseDTO } from "../../DTOClasses/response.DTO.js";
import { OverviewDTO } from "../../DTOClasses/Overview.DTO.js";

const accountRepository = new AwsAccountRepository();
const regionRepository = new AwsRegionRepository();
const instanceRepository = new AwsInstanceRepository();
const rdsRepository = new AwsRdsRepository();
const ecsRepository = new AwsEcsRepository();
const lambdaRepository = new AwsLambdaRepository();
const cloudWatchRepository = new AwsCloudWatchRepository();
const zombieScoringService = new ZombieScoringService();

const overviewService = new OverviewService(
  accountRepository,
  regionRepository,
  instanceRepository,
  rdsRepository,
  ecsRepository,
  lambdaRepository,
  cloudWatchRepository,
  zombieScoringService,
  redisClient
);

export const getOverview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refresh = req.query.refresh === "true";
    const overview = await overviewService.getOverview(refresh);

    const response = new ResponseDTO<OverviewDTO>();
    response.setStatus(true);
    response.setMessage("Account overview retrieved successfully");
    response.setData(overview);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
