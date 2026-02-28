import { ILambdaRepository, LambdaFunction } from "../../interfaces/ILambdaRepository.js";
import { MockCloudState, MockLambdaFunction } from "./MockCloudState.js";

/**
 * MockLambdaRepository - Simulates Lambda operations
 * Implements ILambdaRepository interface
 */
export class MockLambdaRepository implements ILambdaRepository {
  private state: MockCloudState;

  constructor() {
    this.state = MockCloudState.getInstance();
  }

  /**
   * Create a mock Lambda function
   */
  createLambda(
    region: string,
    config: {
      functionName: string;
      runtime?: string;
      memorySize?: number;
      isZombie?: boolean;
    }
  ): MockLambdaFunction {
    return this.state.createLambda(region, config);
  }

  /**
   * List Lambda functions - returns AWS SDK compatible format
   */
  async listLambda(region: string): Promise<{
    Functions: MockLambdaFunction[];
  }> {
    const functions = this.state.listLambda(region);
    return { Functions: functions };
  }

  /**
   * ILambdaRepository implementation
   */
  async getFunctions(region: string): Promise<LambdaFunction[]> {
    const functions = this.state.listLambda(region);
    return functions.map((f) => ({
      functionName: f.FunctionName,
      runtime: f.Runtime,
      lastModified: f.LastModified,
    }));
  }
}
