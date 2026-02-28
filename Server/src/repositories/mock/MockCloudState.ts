// Central state for all mock resources - persisted in Redis
import { redisClient } from "../../configs/redisClient.js";

// Mock EC2 Instance with full details
export interface MockEC2Instance {
  InstanceId: string;
  InstanceType: string;
  State: { Name: "running" | "stopped" };
  LaunchTime: Date;
  Tags: { Key: string; Value: string }[];
  CpuUtilization: number;
  NetworkIn: number;
  NetworkOut: number;
}

// Mock ECS Service with full details
export interface MockECSService {
  serviceName: string;
  status: string;
  runningCount: number;
  desiredCount: number;
  clusterArn: string;
}

// Mock ECS Cluster with full details
export interface MockECSCluster {
  clusterName: string;
  clusterArn: string;
  runningTasksCount: number;
  services: MockECSService[];
}

// Mock Lambda Function with full details
export interface MockLambdaFunction {
  FunctionName: string;
  Runtime: string;
  MemorySize: number;
  LastModified: string;
  Invocations: number;
  FunctionArn: string;
}

// Mock RDS Instance with full details
export interface MockRDSInstance {
  DBInstanceIdentifier: string;
  DBInstanceStatus: string;
  Engine: string;
  CpuUtilization: number;
  Connections: number;
}

// Mock S3 Bucket with full details
export interface MockS3Bucket {
  Name: string;
  CreationDate: Date;
}

// Region data structure
export interface RegionData {
  ec2: MockEC2Instance[];
  ecs: MockECSCluster[];
  lambda: MockLambdaFunction[];
  rds: MockRDSInstance[];
  s3: MockS3Bucket[];
}

// Redis key prefixes
const REDIS_PREFIX = "mock:region:";
const REDIS_KEYS = {
  ec2: (region: string) => `${REDIS_PREFIX}${region}:ec2`,
  ecs: (region: string) => `${REDIS_PREFIX}${region}:ecs`,
  lambda: (region: string) => `${REDIS_PREFIX}${region}:lambda`,
  rds: (region: string) => `${REDIS_PREFIX}${region}:rds`,
  s3: (region: string) => `${REDIS_PREFIX}${region}:s3`,
};

// ID Generators
export const generateEC2InstanceId = (): string => {
  const chars = "abcdef0123456789";
  let id = "i-";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
};

export const generateClusterArn = (region: string, accountId: string, clusterName: string): string => {
  return `arn:aws:ecs:${region}:${accountId}:cluster/${clusterName}`;
};

export const generateFunctionArn = (region: string, accountId: string, functionName: string): string => {
  return `arn:aws:lambda:${region}:${accountId}:function:${functionName}`;
};

// Mock account ID for ARN generation
export const MOCK_ACCOUNT_ID = "123456789012";

// Configuration for mock data generation
export const mockConfig = {
  ec2CpuLow: { min: 0.1, max: 2.0 },      // Zombie indicators
  ec2CpuHigh: { min: 20.0, max: 80.0 },   // Normal usage
  ec2NetworkLow: { min: 100, max: 1000 }, // Zombie indicators
  ec2NetworkHigh: { min: 10000, max: 100000 }, // Normal usage
  lambdaInvocationsLow: { min: 0, max: 10 },    // Zombie indicators
  lambdaInvocationsHigh: { min: 1000, max: 10000 }, // Normal usage
  rdsCpuLow: { min: 0.5, max: 5.0 },      // Zombie indicators
  rdsCpuHigh: { min: 10.0, max: 60.0 },   // Normal usage
  rdsConnectionsLow: { min: 0, max: 2 },  // Zombie indicators
  rdsConnectionsHigh: { min: 10, max: 100 }, // Normal usage
};

export const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Singleton state manager for mock data - persisted in Redis
 */
export class MockCloudState {
  private static instance: MockCloudState;
  private redis: typeof redisClient;

  private constructor() {
    this.redis = redisClient;
  }

  static getInstance(): MockCloudState {
    if (!MockCloudState.instance) {
      MockCloudState.instance = new MockCloudState();
    }
    return MockCloudState.instance;
  }

  // ==================== Redis Helper Methods ====================

  private async getResource<T>(key: string): Promise<T[]> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Redis get error for ${key}:`, error);
      return [];
    }
  }

  private async setResource<T>(key: string, data: T[]): Promise<void> {
    try {
      // No TTL - data persists until explicitly deleted
      await this.redis.set(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Redis set error for ${key}:`, error);
    }
  }

  private async deleteResource(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error(`Redis del error for ${key}:`, error);
    }
  }

  /**
   * Reset all mock data
   */
  async reset(): Promise<void> {
    try {
      const keys = await this.redis.keys(`${REDIS_PREFIX}*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error("Redis reset error:", error);
    }
  }

  /**
   * Clear a specific region
   */
  async clearRegion(region: string): Promise<void> {
    const keys = Object.values(REDIS_KEYS).map((fn) => fn(region));
    try {
      await this.redis.del(...keys);
    } catch (error) {
      console.error(`Redis clearRegion error for ${region}:`, error);
    }
  }

  // ==================== EC2 Operations ====================

  async createEC2(
    region: string,
    config: {
      instanceType?: string;
      state?: "running" | "stopped";
      tags?: Record<string, string>;
      isZombie?: boolean;
    }
  ): Promise<MockEC2Instance> {
    const key = REDIS_KEYS.ec2(region);
    const instances = await this.getResource<MockEC2Instance>(key);
    const instanceId = generateEC2InstanceId();

    const isZombie = config.isZombie ?? Math.random() < 0.3;
    const cpuConfig = isZombie ? mockConfig.ec2CpuLow : mockConfig.ec2CpuHigh;
    const networkConfig = isZombie ? mockConfig.ec2NetworkLow : mockConfig.ec2NetworkHigh;

    const instance: MockEC2Instance = {
      InstanceId: instanceId,
      InstanceType: config.instanceType || "t3.micro",
      State: { Name: config.state || "running" },
      LaunchTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      Tags: Object.entries(config.tags || {}).map(([Key, Value]) => ({ Key, Value })),
      CpuUtilization: randomInRange(cpuConfig.min, cpuConfig.max),
      NetworkIn: randomInRange(networkConfig.min, networkConfig.max),
      NetworkOut: randomInRange(networkConfig.min, networkConfig.max),
    };

    instances.push(instance);
    await this.setResource(key, instances);
    return instance;
  }

  async listEC2(region: string): Promise<MockEC2Instance[]> {
    return this.getResource<MockEC2Instance>(REDIS_KEYS.ec2(region));
  }

  async getEC2Metrics(instanceId: string, region: string): Promise<{ cpu: number; networkIn: number; networkOut: number } | null> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const instances = await this.listEC2(region);
    const instance = instances.find((i) => i.InstanceId === instanceId);
    if (!instance) return null;
    return {
      cpu: instance.CpuUtilization,
      networkIn: instance.NetworkIn,
      networkOut: instance.NetworkOut,
    };
  }

  // ==================== ECS Operations ====================

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
    const key = REDIS_KEYS.ecs(region);
    const clusters = await this.getResource<MockECSCluster>(key);
    const clusterArn = generateClusterArn(region, MOCK_ACCOUNT_ID, config.clusterName);

    const services: MockECSService[] =
      config.services?.map((s) => ({
        serviceName: s.serviceName,
        status: s.status || "ACTIVE",
        runningCount: s.runningCount,
        desiredCount: s.desiredCount,
        clusterArn,
      })) || [];

    const cluster: MockECSCluster = {
      clusterName: config.clusterName,
      clusterArn,
      runningTasksCount: services.reduce((sum, s) => sum + s.runningCount, 0),
      services,
    };

    clusters.push(cluster);
    await this.setResource(key, clusters);
    return cluster;
  }

  async listECS(region: string): Promise<MockECSCluster[]> {
    return this.getResource<MockECSCluster>(REDIS_KEYS.ecs(region));
  }

  // ==================== Lambda Operations ====================

  async createLambda(
    region: string,
    config: {
      functionName: string;
      runtime?: string;
      memorySize?: number;
      isZombie?: boolean;
    }
  ): Promise<MockLambdaFunction> {
    const key = REDIS_KEYS.lambda(region);
    const functions = await this.getResource<MockLambdaFunction>(key);

    const isZombie = config.isZombie ?? Math.random() < 0.3;
    const invConfig = isZombie
      ? mockConfig.lambdaInvocationsLow
      : mockConfig.lambdaInvocationsHigh;

    const func: MockLambdaFunction = {
      FunctionName: config.functionName,
      Runtime: config.runtime || "nodejs18.x",
      MemorySize: config.memorySize || 128,
      LastModified: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      Invocations: Math.floor(randomInRange(invConfig.min, invConfig.max)),
      FunctionArn: generateFunctionArn(region, MOCK_ACCOUNT_ID, config.functionName),
    };

    functions.push(func);
    await this.setResource(key, functions);
    return func;
  }

  async listLambda(region: string): Promise<MockLambdaFunction[]> {
    return this.getResource<MockLambdaFunction>(REDIS_KEYS.lambda(region));
  }

  async getLambdaMetrics(functionName: string, region: string): Promise<{ invocations: number } | null> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const functions = await this.listLambda(region);
    const func = functions.find((f) => f.FunctionName === functionName);
    if (!func) return null;
    return { invocations: func.Invocations };
  }

  // ==================== RDS Operations ====================

  async createRDS(
    region: string,
    config: {
      dbInstanceIdentifier: string;
      engine?: string;
      status?: "available" | "creating" | "deleting";
      isZombie?: boolean;
    }
  ): Promise<MockRDSInstance> {
    const key = REDIS_KEYS.rds(region);
    const instances = await this.getResource<MockRDSInstance>(key);

    const isZombie = config.isZombie ?? Math.random() < 0.3;
    const cpuConfig = isZombie ? mockConfig.rdsCpuLow : mockConfig.rdsCpuHigh;
    const connConfig = isZombie ? mockConfig.rdsConnectionsLow : mockConfig.rdsConnectionsHigh;

    const instance: MockRDSInstance = {
      DBInstanceIdentifier: config.dbInstanceIdentifier,
      DBInstanceStatus: config.status || "available",
      Engine: config.engine || "postgres",
      CpuUtilization: randomInRange(cpuConfig.min, cpuConfig.max),
      Connections: Math.floor(randomInRange(connConfig.min, connConfig.max)),
    };

    instances.push(instance);
    await this.setResource(key, instances);
    return instance;
  }

  async listRDS(region: string): Promise<MockRDSInstance[]> {
    return this.getResource<MockRDSInstance>(REDIS_KEYS.rds(region));
  }

  async getRDSMetrics(dbInstanceIdentifier: string, region: string): Promise<{ cpu: number; connections: number } | null> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const instances = await this.listRDS(region);
    const instance = instances.find(
      (i) => i.DBInstanceIdentifier === dbInstanceIdentifier
    );
    if (!instance) return null;
    return {
      cpu: instance.CpuUtilization,
      connections: instance.Connections,
    };
  }

  // ==================== S3 Operations ====================

  async createS3(
    region: string,
    config: {
      bucketName: string;
    }
  ): Promise<MockS3Bucket> {
    const key = REDIS_KEYS.s3(region);
    const buckets = await this.getResource<MockS3Bucket>(key);

    const bucket: MockS3Bucket = {
      Name: config.bucketName,
      CreationDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    };

    buckets.push(bucket);
    await this.setResource(key, buckets);
    return bucket;
  }

  async listS3(region: string): Promise<MockS3Bucket[]> {
    return this.getResource<MockS3Bucket>(REDIS_KEYS.s3(region));
  }
}
