import { IAccountRepository } from "../interfaces/IAccountRepository.js";
import { IRegionRepository } from "../interfaces/IRegionRepository.js";
import { IInstanceRepository } from "../interfaces/IInstanceRepository.js";
import { IVolumeRepository } from "../interfaces/IVolumeRepository.js";
import { AccountSummaryDTO } from "../DTOClasses/AccountSummary.DTO.js";
import { RegionSummaryDTO } from "../DTOClasses/RegionSummary.DTO.js";

export class AccountScanService {
  constructor(
    private accountRepository: IAccountRepository,
    private regionRepository: IRegionRepository,
    private instanceRepository: IInstanceRepository,
    private volumeRepository: IVolumeRepository
  ) {}

  async scanAccount(): Promise<AccountSummaryDTO> {
    const accountInfo = await this.accountRepository.getAccountInfo();
    const regions = await this.regionRepository.getAllRegions();

    const regionSummaries = await Promise.all(
      regions.map(async (region) => {
        const [runningInstances, unattachedVolumes] = await Promise.all([
          this.instanceRepository.countRunningInstances(region.regionName),
          this.volumeRepository.countUnattachedVolumes(region.regionName),
        ]);

        return new RegionSummaryDTO(
          region.regionName,
          runningInstances,
          unattachedVolumes
        );
      })
    );

    return new AccountSummaryDTO(
      accountInfo.accountId,
      accountInfo.userArn,
      regionSummaries
    );
  }
}
