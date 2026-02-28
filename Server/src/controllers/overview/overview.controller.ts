import { Request, Response, NextFunction } from "express";
import { OverviewService } from "../../services/OverviewService.js";
import { ZombieScoringService } from "../../services/ZombieScoringService.js";
import { redisClient } from "../../configs/redisClient.js";
import { RepositoryFactory } from "../../configs/repositoryFactory.js";
import { ResponseDTO } from "../../DTOClasses/response.DTO.js";
import { OverviewDTO } from "../../DTOClasses/Overview.DTO.js";

// Get repositories from factory (switches between AWS and Mock based on USE_MOCK env var)
const accountRepository = RepositoryFactory.getAccountRepository();
const regionRepository = RepositoryFactory.getRegionRepository();
const instanceRepository = RepositoryFactory.getInstanceRepository();
const rdsRepository = RepositoryFactory.getRdsRepository();
const ecsRepository = RepositoryFactory.getEcsRepository();
const lambdaRepository = RepositoryFactory.getLambdaRepository();
const volumeRepository = RepositoryFactory.getVolumeRepository();
const cloudWatchRepository = RepositoryFactory.getCloudWatchRepository();
const zombieScoringService = new ZombieScoringService();

const overviewService = new OverviewService(
  accountRepository,
  regionRepository,
  instanceRepository,
  rdsRepository,
  ecsRepository,
  lambdaRepository,
  volumeRepository,
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
