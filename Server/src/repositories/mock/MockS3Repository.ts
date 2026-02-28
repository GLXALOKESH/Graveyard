import { MockCloudState, MockS3Bucket } from "./MockCloudState.js";

// S3 Bucket interface
export interface S3Bucket {
  name: string;
  creationDate: Date;
}

// S3 Repository Interface
export interface IS3Repository {
  getBuckets(region: string): Promise<S3Bucket[]>;
}

/**
 * MockS3Repository - Simulates S3 operations
 * Implements IS3Repository interface
 */
export class MockS3Repository implements IS3Repository {
  private state: MockCloudState;

  constructor() {
    this.state = MockCloudState.getInstance();
  }

  /**
   * Create a mock S3 bucket
   */
  async createS3(
    region: string,
    config: {
      bucketName: string;
    }
  ): Promise<MockS3Bucket> {
    return this.state.createS3(region, config);
  }

  /**
   * List S3 buckets - returns AWS SDK compatible format
   */
  async listS3(region: string): Promise<{
    Buckets: MockS3Bucket[];
  }> {
    const buckets = await this.state.listS3(region);
    return { Buckets: buckets };
  }

  /**
   * IS3Repository implementation
   */
  async getBuckets(region: string): Promise<S3Bucket[]> {
    const buckets = await this.state.listS3(region);
    return buckets.map((b) => ({
      name: b.Name,
      creationDate: b.CreationDate,
    }));
  }
}
