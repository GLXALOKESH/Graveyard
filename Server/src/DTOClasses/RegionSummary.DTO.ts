export class RegionSummaryDTO {
  region: string;
  runningInstances: number;
  unattachedVolumes: number;

  constructor(
    region: string,
    runningInstances: number,
    unattachedVolumes: number
  ) {
    this.region = region;
    this.runningInstances = runningInstances;
    this.unattachedVolumes = unattachedVolumes;
  }
}
