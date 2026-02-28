import { IAccountRepository } from "../interfaces/IAccountRepository.js";
import { IRegionRepository } from "../interfaces/IRegionRepository.js";
import { IInstanceRepository } from "../interfaces/IInstanceRepository.js";
import { IRDSRepository } from "../interfaces/IRDSRepository.js";
import { IEcsRepository } from "../interfaces/IEcsRepository.js";
import { ILambdaRepository } from "../interfaces/ILambdaRepository.js";
import { ICloudWatchRepository } from "../interfaces/ICloudWatchRepository.js";
import { IVolumeRepository } from "../interfaces/IVolumeRepository.js";

// AWS Repositories
import { AwsAccountRepository } from "../repositories/AwsAccountRepository.js";
import { AwsRegionRepository } from "../repositories/AwsRegionRepository.js";
import { AwsInstanceRepository } from "../repositories/AwsInstanceRepository.js";
import { AwsRdsRepository } from "../repositories/AwsRdsRepository.js";
import { AwsEcsRepository } from "../repositories/AwsEcsRepository.js";
import { AwsLambdaRepository } from "../repositories/AwsLambdaRepository.js";
import { AwsCloudWatchRepository } from "../repositories/AwsCloudWatchRepository.js";
import { AwsVolumeRepository } from "../repositories/AwsVolumeRepository.js";

// Mock Repositories
import {
  MockAccountRepository,
  MockRegionRepository,
  MockInstanceRepository,
  MockRdsRepository,
  MockEcsRepository,
  MockLambdaRepository,
  MockCloudWatchRepository,
  MockVolumeRepository,
} from "../repositories/mock/index.js";

// AWS SDK clients factory with dynamic credentials
import {
  createSTSClientWithCredentials,
  createEC2ClientWithCredentials,
  AWSCredentials,
} from "./awsClientFactory.js";

// AWSCredentials is imported from awsClientFactory.js

/**
 * Creates AWS repositories with specific credentials
 */
class DynamicAwsAccountRepository extends AwsAccountRepository {
  constructor(credentials: AWSCredentials, region: string) {
    super();
    // Override the STS client with credentials
    (this as any).stsClient = createSTSClientWithCredentials(region, credentials);
  }
}

class DynamicAwsRegionRepository extends AwsRegionRepository {
  constructor(credentials: AWSCredentials, region: string) {
    super();
    // Override the EC2 client with credentials
    (this as any).ec2Client = createEC2ClientWithCredentials(region, credentials);
  }
}

class DynamicAwsInstanceRepository extends AwsInstanceRepository {
  private credentials: AWSCredentials;

  constructor(credentials: AWSCredentials) {
    super();
    this.credentials = credentials;
  }

  // Override to create client with credentials per call
  protected createClient(region: string) {
    return createEC2ClientWithCredentials(region, this.credentials);
  }
}

class DynamicAwsVolumeRepository extends AwsVolumeRepository {
  private credentials: AWSCredentials;

  constructor(credentials: AWSCredentials) {
    super();
    this.credentials = credentials;
  }

  // Override to create client with credentials per call
  protected createClient(region: string) {
    return createEC2ClientWithCredentials(region, this.credentials);
  }
}

/**
 * Repository Collection Interface
 */
export interface RepositoryCollection {
  accountRepository: IAccountRepository;
  regionRepository: IRegionRepository;
  instanceRepository: IInstanceRepository;
  rdsRepository: IRDSRepository;
  ecsRepository: IEcsRepository;
  lambdaRepository: ILambdaRepository;
  cloudWatchRepository: ICloudWatchRepository;
  volumeRepository: IVolumeRepository;
}

/**
 * Dynamic Repository Factory
 * Creates repositories based on account type and credentials
 */
export class DynamicRepositoryFactory {
  /**
   * Create repositories for mock data (no credentials needed)
   */
  static createMockRepositories(): RepositoryCollection {
    return {
      accountRepository: new MockAccountRepository(),
      regionRepository: new MockRegionRepository(),
      instanceRepository: new MockInstanceRepository(),
      rdsRepository: new MockRdsRepository(),
      ecsRepository: new MockEcsRepository(),
      lambdaRepository: new MockLambdaRepository(),
      cloudWatchRepository: new MockCloudWatchRepository(),
      volumeRepository: new MockVolumeRepository(),
    };
  }

  /**
   * Create repositories for real AWS with provided credentials
   */
  static createAWSRepositories(
    credentials: AWSCredentials,
    region: string = "us-east-1"
  ): RepositoryCollection {
    return {
      accountRepository: new DynamicAwsAccountRepository(credentials, region),
      regionRepository: new DynamicAwsRegionRepository(credentials, region),
      instanceRepository: new AwsInstanceRepository(), // Uses env vars - need to update
      rdsRepository: new AwsRdsRepository(),
      ecsRepository: new AwsEcsRepository(),
      lambdaRepository: new AwsLambdaRepository(),
      cloudWatchRepository: new AwsCloudWatchRepository(),
      volumeRepository: new AwsVolumeRepository(),
    };
  }

  /**
   * Create repositories based on request
   */
  static createRepositories(
    accountType: "mock" | "real",
    credentials?: AWSCredentials,
    region?: string
  ): RepositoryCollection {
    if (accountType === "mock") {
      return this.createMockRepositories();
    }

    if (!credentials) {
      throw new Error("AWS credentials are required for real account type");
    }

    return this.createAWSRepositories(credentials, region);
  }
}
