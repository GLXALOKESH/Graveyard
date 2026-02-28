import { RegionSummaryDTO } from "./RegionSummary.DTO.js";

export class AccountSummaryDTO {
  accountId: string;
  userArn: string;
  regions: RegionSummaryDTO[];

  constructor(
    accountId: string,
    userArn: string,
    regions: RegionSummaryDTO[]
  ) {
    this.accountId = accountId;
    this.userArn = userArn;
    this.regions = regions;
  }
}
