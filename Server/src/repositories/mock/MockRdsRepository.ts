import { IRDSRepository, RDSInstance } from "../../interfaces/IRDSRepository.js";
import { MockCloudState, MockRDSInstance } from "./MockCloudState.js";

/**
 * MockRdsRepository - Simulates RDS operations
 * Implements IRDSRepository interface
 */
export class MockRdsRepository implements IRDSRepository {
  private state: MockCloudState;

  constructor() {
    this.state = MockCloudState.getInstance();
  }

  /**
   * Create a mock RDS instance
   */
  createRDS(
    region: string,
    config: {
      dbInstanceIdentifier: string;
      engine?: string;
      status?: "available" | "creating" | "deleting";
      isZombie?: boolean;
    }
  ): MockRDSInstance {
    return this.state.createRDS(region, config);
  }

  /**
   * List RDS instances - returns AWS SDK compatible format
   */
  async listRDS(region: string): Promise<{
    DBInstances: MockRDSInstance[];
  }> {
    const instances = this.state.listRDS(region);
    return { DBInstances: instances };
  }

  /**
   * IRDSRepository implementation
   */
  async getRunningInstances(region: string): Promise<RDSInstance[]> {
    const instances = this.state.listRDS(region);
    return instances
      .filter((i) => i.DBInstanceStatus === "available")
      .map((i) => ({
        dbInstanceIdentifier: i.DBInstanceIdentifier,
        dbInstanceStatus: i.DBInstanceStatus,
        engine: i.Engine,
      }));
  }
}
