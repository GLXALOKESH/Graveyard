import {
  IInstanceRepository,
  EC2Instance,
} from "../../interfaces/IInstanceRepository.js";
import { MockCloudState, MockEC2Instance } from "./MockCloudState.js";

/**
 * MockInstanceRepository - Simulates EC2 operations
 * Implements IInstanceRepository interface
 */
export class MockInstanceRepository implements IInstanceRepository {
  private state: MockCloudState;

  constructor() {
    this.state = MockCloudState.getInstance();
  }

  /**
   * Create a mock EC2 instance
   */
  async createEC2(
    region: string,
    config: {
      instanceType?: string;
      state?: "running" | "stopped";
      tags?: Record<string, string>;
      isZombie?: boolean;
    }
  ): Promise<MockEC2Instance> {
    return this.state.createEC2(region, config);
  }

  /**
   * List EC2 instances - returns AWS SDK compatible format
   */
  async listEC2(region: string): Promise<{
    Reservations: Array<{
      Instances: MockEC2Instance[];
    }>;
  }> {
    const instances = await this.state.listEC2(region);
    return {
      Reservations: instances.length > 0 ? [{ Instances: instances }] : [],
    };
  }

  /**
   * IInstanceRepository implementation
   */
  async countRunningInstances(region: string): Promise<number> {
    const instances = await this.state.listEC2(region);
    return instances.filter((i) => i.State.Name === "running").length;
  }

  async getRunningInstances(region: string): Promise<EC2Instance[]> {
    const instances = await this.state.listEC2(region);
    return instances
      .filter((i) => i.State.Name === "running")
      .map((i) => ({
        instanceId: i.InstanceId,
        instanceType: i.InstanceType,
        tags: Object.fromEntries(i.Tags.map((t) => [t.Key, t.Value])),
      }));
  }
}
