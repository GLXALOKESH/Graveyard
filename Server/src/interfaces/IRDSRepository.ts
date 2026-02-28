export interface RDSInstance {
  dbInstanceIdentifier: string;
  dbInstanceStatus: string;
  engine: string;
}

export interface IRDSRepository {
  getRunningInstances(region: string): Promise<RDSInstance[]>;
}
