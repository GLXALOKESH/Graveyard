import { EC2OverviewDTO } from "./EC2Overview.DTO.js";
import { RDSOverviewDTO } from "./RDSOverview.DTO.js";
import { ECSOverviewDTO } from "./ECSOverview.DTO.js";
import { LambdaOverviewDTO } from "./LambdaOverview.DTO.js";

export class RegionOverviewDTO {
  region: string;
  ec2: EC2OverviewDTO;
  rds: RDSOverviewDTO;
  ecs: ECSOverviewDTO;
  lambda: LambdaOverviewDTO;
  regionZombieScore: number;

  constructor(
    region: string,
    ec2: EC2OverviewDTO,
    rds: RDSOverviewDTO,
    ecs: ECSOverviewDTO,
    lambda: LambdaOverviewDTO,
    regionZombieScore: number
  ) {
    this.region = region;
    this.ec2 = ec2;
    this.rds = rds;
    this.ecs = ecs;
    this.lambda = lambda;
    this.regionZombieScore = regionZombieScore;
  }
}
