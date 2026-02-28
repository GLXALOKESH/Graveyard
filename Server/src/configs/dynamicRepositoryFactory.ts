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
  createRDSClientWithCredentials,
  createECSClientWithCredentials,
  createLambdaClientWithCredentials,
  createCloudWatchClientWithCredentials,
  AWSCredentials,
} from "./awsClientFactory.js";

// AWSCredentials is imported from awsClientFactory.js

/**
 * Creates AWS repositories with specific credentials
 * Each repository creates clients on-demand with the provided credentials
 */
class DynamicAwsAccountRepository extends AwsAccountRepository {
  private credentials: AWSCredentials;
  private region: string;

  constructor(credentials: AWSCredentials, region: string) {
    super();
    this.credentials = credentials;
    this.region = region;
  }

  // Override to create client with credentials
  protected createSTSClient(): import("@aws-sdk/client-sts").STSClient {
    return createSTSClientWithCredentials(this.region, this.credentials);
  }
}

class DynamicAwsRegionRepository extends AwsRegionRepository {
  private credentials: AWSCredentials;
  private region: string;

  constructor(credentials: AWSCredentials, region: string) {
    super();
    this.credentials = credentials;
    this.region = region;
  }

  // Override to create client with credentials
  protected createEC2Client(): import("@aws-sdk/client-ec2").EC2Client {
    return createEC2ClientWithCredentials(this.region, this.credentials);
  }
}

class DynamicAwsInstanceRepository extends AwsInstanceRepository {
  private credentials: AWSCredentials;

  constructor(credentials: AWSCredentials) {
    super();
    this.credentials = credentials;
  }

  // Override to create client with credentials per call
  protected createEC2Client(region: string): import("@aws-sdk/client-ec2").EC2Client {
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
  protected createEC2Client(region: string): import("@aws-sdk/client-ec2").EC2Client {
    return createEC2ClientWithCredentials(region, this.credentials);
  }
}

class DynamicAwsRdsRepository extends AwsRdsRepository {
  private credentials: AWSCredentials;

  constructor(credentials: AWSCredentials) {
    super();
    this.credentials = credentials;
  }

  // Override to create client with credentials per call
  protected createRDSClient(region: string): import("@aws-sdk/client-rds").RDSClient {
    return createRDSClientWithCredentials(region, this.credentials);
  }
}

class DynamicAwsEcsRepository extends AwsEcsRepository {
  private credentials: AWSCredentials;

  constructor(credentials: AWSCredentials) {
    super();
    this.credentials = credentials;
  }

  // Override to create client with credentials per call
  protected createECSClient(region: string): import("@aws-sdk/client-ecs").ECSClient {
    return createECSClientWithCredentials(region, this.credentials);
  }
}

class DynamicAwsLambdaRepository extends AwsLambdaRepository {
  private credentials: AWSCredentials;

  constructor(credentials: AWSCredentials) {
    super();
    this.credentials = credentials;
  }

  // Override to create client with credentials per call
  protected createLambdaClient(region: string): import("@aws-sdk/client-lambda").LambdaClient {
    return createLambdaClientWithCredentials(region, this.credentials);
  }
}

class DynamicAwsCloudWatchRepository extends AwsCloudWatchRepository {
  private credentials: AWSCredentials;

  constructor(credentials: AWSCredentials) {
    super();
    this.credentials = credentials;
  }

  // Override to create client with credentials per call
  protected createCloudWatchClient(region: string): import("@aws-sdk/client-cloudwatch").CloudWatchClient {
    return createCloudWatchClientWithCredentials(region, this.credentials);
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
      instanceRepository: new DynamicAwsInstanceRepository(credentials),
      rdsRepository: new DynamicAwsRdsRepository(credentials),
      ecsRepository: new DynamicAwsEcsRepository(credentials),
      lambdaRepository: new DynamicAwsLambdaRepository(credentials),
      cloudWatchRepository: new DynamicAwsCloudWatchRepository(credentials),
      volumeRepository: new DynamicAwsVolumeRepository(credentials),
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
