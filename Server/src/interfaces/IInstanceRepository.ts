export interface EC2Instance {
  instanceId: string;
  instanceType: string;
  tags: Record<string, string>;
}

export interface IInstanceRepository {
  countRunningInstances(region: string): Promise<number>;
  getRunningInstances(region: string): Promise<EC2Instance[]>;
}
