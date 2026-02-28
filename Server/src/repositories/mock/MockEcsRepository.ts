import { IEcsRepository, ECSCluster, ECSService } from "../../interfaces/IEcsRepository.js";
import { MockCloudState, MockECSCluster, MockECSService } from "./MockCloudState.js";

/**
 * MockEcsRepository - Simulates ECS operations
 * Implements IEcsRepository interface
 */
export class MockEcsRepository implements IEcsRepository {
  private state: MockCloudState;

  constructor() {
    this.state = MockCloudState.getInstance();
  }

  /**
   * Create a mock ECS cluster with services
   */
  async createECS(
    region: string,
    config: {
      clusterName: string;
      services?: Array<{
        serviceName: string;
        runningCount: number;
        desiredCount: number;
        status?: string;
      }>;
    }
  ): Promise<MockECSCluster> {
    return this.state.createECS(region, config);
  }

  /**
   * List ECS clusters - returns AWS SDK compatible format
   */
  async listECS(region: string): Promise<{
    clusters: MockECSCluster[];
  }> {
    const clusters = await this.state.listECS(region);
    return { clusters };
  }

  /**
   * IEcsRepository implementation
   */
  async getClusters(region: string): Promise<ECSCluster[]> {
    const clusters = await this.state.listECS(region);
    return clusters.map((c) => ({
      clusterName: c.clusterName,
      clusterArn: c.clusterArn,
      runningTasksCount: c.runningTasksCount,
    }));
  }

  async getServices(region: string, clusterArn: string): Promise<ECSService[]> {
    const clusters = await this.state.listECS(region);
    const cluster = clusters.find((c) => c.clusterArn === clusterArn);
    if (!cluster) return [];

    return cluster.services.map((s) => ({
      serviceName: s.serviceName,
      runningCount: s.runningCount,
      desiredCount: s.desiredCount,
      clusterArn,
    }));
  }
}
