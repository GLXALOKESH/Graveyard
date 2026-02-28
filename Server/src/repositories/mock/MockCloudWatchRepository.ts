import { ICloudWatchRepository } from "../../interfaces/ICloudWatchRepository.js";
import { MockCloudState } from "./MockCloudState.js";

/**
 * MockCloudWatchRepository - Simulates CloudWatch metrics
 * Implements ICloudWatchRepository interface
 * Returns metrics stored in mock resources
 */
export class MockCloudWatchRepository implements ICloudWatchRepository {
  private state: MockCloudState;

  constructor() {
    this.state = MockCloudState.getInstance();
  }

  /**
   * Get EC2 CPU utilization from mock instance
   */
  async getEC2CPUUtilization(
    region: string,
    instanceId: string,
    _days?: number
  ): Promise<number> {
    const metrics = await this.state.getEC2Metrics(instanceId, region);
    return metrics?.cpu ?? 0;
  }

  /**
   * Get RDS CPU utilization from mock instance
   */
  async getRDSCPUUtilization(
    region: string,
    dbInstanceIdentifier: string,
    _days?: number
  ): Promise<number> {
    const metrics = await this.state.getRDSMetrics(dbInstanceIdentifier, region);
    return metrics?.cpu ?? 0;
  }

  /**
   * Get Lambda invocations from mock function
   */
  async getLambdaInvocations(
    region: string,
    functionName: string,
    _days?: number
  ): Promise<number> {
    const metrics = await this.state.getLambdaMetrics(functionName, region);
    return metrics?.invocations ?? 0;
  }

  /**
   * Get Lambda duration (mock value)
   */
  async getLambdaDuration(
    _region: string,
    _functionName: string,
    _days?: number
  ): Promise<number> {
    // Return a mock duration between 100ms and 1000ms
    return Math.floor(Math.random() * 900) + 100;
  }

  /**
   * Get EC2 network traffic (combined in + out)
   */
  async getEC2NetworkTraffic(
    region: string,
    instanceId: string,
    _days?: number
  ): Promise<number> {
    const metrics = await this.state.getEC2Metrics(instanceId, region);
    if (!metrics) return 0;
    return metrics.networkIn + metrics.networkOut;
  }

  /**
   * Get RDS database connections
   */
  async getRDSConnections(
    region: string,
    dbInstanceIdentifier: string,
    _days?: number
  ): Promise<number> {
    const metrics = await this.state.getRDSMetrics(dbInstanceIdentifier, region);
    return metrics?.connections ?? 0;
  }
}
