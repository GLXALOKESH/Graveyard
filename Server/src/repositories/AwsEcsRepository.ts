import {
  ECSClient,
  ListClustersCommand,
  DescribeClustersCommand,
  ListServicesCommand,
  DescribeServicesCommand,
} from "@aws-sdk/client-ecs";
import {
  IEcsRepository,
  ECSCluster,
  ECSService,
} from "../interfaces/IEcsRepository.js";
import { createECSClient } from "../configs/awsClientFactory.js";

export class AwsEcsRepository implements IEcsRepository {
  protected createECSClient(region: string): ECSClient {
    return createECSClient(region);
  }

  async getClusters(region: string): Promise<ECSCluster[]> {
    const ecsClient = this.createECSClient(region);

    try {
      const clusters: ECSCluster[] = [];
      let nextToken: string | undefined;

      do {
        const listCommand = new ListClustersCommand({
          nextToken,
        });

        const listResponse = await ecsClient.send(listCommand);

        if (listResponse.clusterArns && listResponse.clusterArns.length > 0) {
          const describeCommand = new DescribeClustersCommand({
            clusters: listResponse.clusterArns,
          });

          const describeResponse = await ecsClient.send(describeCommand);

          if (describeResponse.clusters) {
            for (const cluster of describeResponse.clusters) {
              if (cluster.clusterName && cluster.clusterArn) {
                clusters.push({
                  clusterName: cluster.clusterName,
                  clusterArn: cluster.clusterArn,
                  runningTasksCount: cluster.runningTasksCount || 0,
                });
              }
            }
          }
        }

        nextToken = listResponse.nextToken;
      } while (nextToken);

      return clusters;
    } finally {
      ecsClient.destroy();
    }
  }

  async getServices(
    region: string,
    clusterArn: string
  ): Promise<ECSService[]> {
    const ecsClient = this.createECSClient(region);

    try {
      const services: ECSService[] = [];
      let nextToken: string | undefined;

      do {
        const listCommand = new ListServicesCommand({
          cluster: clusterArn,
          nextToken,
        });

        const listResponse = await ecsClient.send(listCommand);

        if (listResponse.serviceArns && listResponse.serviceArns.length > 0) {
          const describeCommand = new DescribeServicesCommand({
            cluster: clusterArn,
            services: listResponse.serviceArns,
          });

          const describeResponse = await ecsClient.send(describeCommand);

          if (describeResponse.services) {
            for (const service of describeResponse.services) {
              if (service.serviceName) {
                services.push({
                  serviceName: service.serviceName,
                  runningCount: service.runningCount || 0,
                  desiredCount: service.desiredCount || 0,
                  clusterArn: clusterArn,
                });
              }
            }
          }
        }

        nextToken = listResponse.nextToken;
      } while (nextToken);

      return services;
    } finally {
      ecsClient.destroy();
    }
  }
}
