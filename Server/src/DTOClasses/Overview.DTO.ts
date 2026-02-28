import { RegionOverviewDTO } from "./RegionOverview.DTO.js";

export class OverviewDTO {
  accountId: string;
  userArn: string;
  overallZombieScore: number;
  regions: RegionOverviewDTO[];

  constructor(
    accountId: string,
    userArn: string,
    overallZombieScore: number,
    regions: RegionOverviewDTO[]
  ) {
    this.accountId = accountId;
    this.userArn = userArn;
    this.overallZombieScore = overallZombieScore;
    this.regions = regions;
  }
}
