export interface MetricDataPoint {
  timestamp: Date;
  value: number;
}

export interface ICloudWatchRepository {
  getEC2CPUUtilization(
    region: string,
    instanceId: string,
    days?: number
  ): Promise<number>;

  getRDSCPUUtilization(
    region: string,
    dbInstanceIdentifier: string,
    days?: number
  ): Promise<number>;

  getLambdaInvocations(
    region: string,
    functionName: string,
    days?: number
  ): Promise<number>;

  getLambdaDuration(
    region: string,
    functionName: string,
    days?: number
  ): Promise<number>;

  getEC2NetworkTraffic(
    region: string,
    instanceId: string,
    days?: number
  ): Promise<number>;

  getRDSConnections(
    region: string,
    dbInstanceIdentifier: string,
    days?: number
  ): Promise<number>;
}
