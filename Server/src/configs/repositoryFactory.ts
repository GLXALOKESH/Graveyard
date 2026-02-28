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

/**
 * Repository Factory
 * Creates either AWS or Mock repositories based on USE_MOCK environment variable
 */
export class RepositoryFactory {
  private static useMock: boolean = process.env.USE_MOCK === "true";

  // Singleton instances
  private static accountRepository: IAccountRepository | null = null;
  private static regionRepository: IRegionRepository | null = null;
  private static instanceRepository: IInstanceRepository | null = null;
  private static rdsRepository: IRDSRepository | null = null;
  private static ecsRepository: IEcsRepository | null = null;
  private static lambdaRepository: ILambdaRepository | null = null;
  private static cloudWatchRepository: ICloudWatchRepository | null = null;
  private static volumeRepository: IVolumeRepository | null = null;

  /**
   * Check if mock mode is enabled
   */
  static isMockMode(): boolean {
    return this.useMock;
  }

  /**
   * Set mock mode (useful for testing)
   */
  static setMockMode(enabled: boolean): void {
    this.useMock = enabled;
    // Clear cached instances when switching modes
    this.clearCache();
  }

  /**
   * Clear all cached repository instances
   */
  static clearCache(): void {
    this.accountRepository = null;
    this.regionRepository = null;
    this.instanceRepository = null;
    this.rdsRepository = null;
    this.ecsRepository = null;
    this.lambdaRepository = null;
    this.cloudWatchRepository = null;
    this.volumeRepository = null;
  }

  /**
   * Get Account Repository
   */
  static getAccountRepository(): IAccountRepository {
    if (!this.accountRepository) {
      this.accountRepository = this.useMock
        ? new MockAccountRepository()
        : new AwsAccountRepository();
    }
    return this.accountRepository;
  }

  /**
   * Get Region Repository
   */
  static getRegionRepository(): IRegionRepository {
    if (!this.regionRepository) {
      this.regionRepository = this.useMock
        ? new MockRegionRepository()
        : new AwsRegionRepository();
    }
    return this.regionRepository;
  }

  /**
   * Get Instance (EC2) Repository
   */
  static getInstanceRepository(): IInstanceRepository {
    if (!this.instanceRepository) {
      this.instanceRepository = this.useMock
        ? new MockInstanceRepository()
        : new AwsInstanceRepository();
    }
    return this.instanceRepository;
  }

  /**
   * Get RDS Repository
   */
  static getRdsRepository(): IRDSRepository {
    if (!this.rdsRepository) {
      this.rdsRepository = this.useMock
        ? new MockRdsRepository()
        : new AwsRdsRepository();
    }
    return this.rdsRepository;
  }

  /**
   * Get ECS Repository
   */
  static getEcsRepository(): IEcsRepository {
    if (!this.ecsRepository) {
      this.ecsRepository = this.useMock
        ? new MockEcsRepository()
        : new AwsEcsRepository();
    }
    return this.ecsRepository;
  }

  /**
   * Get Lambda Repository
   */
  static getLambdaRepository(): ILambdaRepository {
    if (!this.lambdaRepository) {
      this.lambdaRepository = this.useMock
        ? new MockLambdaRepository()
        : new AwsLambdaRepository();
    }
    return this.lambdaRepository;
  }

  /**
   * Get CloudWatch Repository
   */
  static getCloudWatchRepository(): ICloudWatchRepository {
    if (!this.cloudWatchRepository) {
      this.cloudWatchRepository = this.useMock
        ? new MockCloudWatchRepository()
        : new AwsCloudWatchRepository();
    }
    return this.cloudWatchRepository;
  }

  /**
   * Get Volume Repository
   */
  static getVolumeRepository(): IVolumeRepository {
    if (!this.volumeRepository) {
      this.volumeRepository = this.useMock
        ? new MockVolumeRepository()
        : new AwsVolumeRepository();
    }
    return this.volumeRepository;
  }
}
