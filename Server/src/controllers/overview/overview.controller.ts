import { Request, Response, NextFunction } from "express";
import { OverviewService } from "../../services/OverviewService.js";
import { ZombieScoringService } from "../../services/ZombieScoringService.js";
import { redisClient } from "../../configs/redisClient.js";
import { DynamicRepositoryFactory } from "../../configs/dynamicRepositoryFactory.js";
import { ResponseDTO } from "../../DTOClasses/response.DTO.js";
import { OverviewDTO } from "../../DTOClasses/Overview.DTO.js";

export const getAccountOverview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountType, credentials, region } = req.body;
    const refresh = req.query.refresh === "true";

    // Create repositories dynamically based on request
    const repos = DynamicRepositoryFactory.createRepositories(
      accountType,
      credentials,
      region
    );

    const zombieScoringService = new ZombieScoringService();

    const overviewService = new OverviewService(
      repos.accountRepository,
      repos.regionRepository,
      repos.instanceRepository,
      repos.rdsRepository,
      repos.ecsRepository,
      repos.lambdaRepository,
      repos.volumeRepository,
      repos.cloudWatchRepository,
      zombieScoringService,
      redisClient
    );

    const overview = await overviewService.getAccountOverview(refresh);

    const response = new ResponseDTO<OverviewDTO>();
    response.setStatus(true);
    response.setMessage("Account overview retrieved successfully");
    response.setData(overview);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
