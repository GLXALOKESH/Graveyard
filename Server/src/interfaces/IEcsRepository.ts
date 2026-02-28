export interface ECSService {
  serviceName: string;
  runningCount: number;
  desiredCount: number;
  clusterArn: string;
}

export interface ECSCluster {
  clusterName: string;
  clusterArn: string;
  runningTasksCount: number;
}

export interface IEcsRepository {
  getClusters(region: string): Promise<ECSCluster[]>;
  getServices(region: string, clusterArn: string): Promise<ECSService[]>;
}
