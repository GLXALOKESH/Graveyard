// Central in-memory state for all mock repositories

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
 * Singleton state manager for mock data
 */
export class MockCloudState {
  private static instance: MockCloudState;
  private regions: Map<string, RegionData>;

  private constructor() {
    this.regions = new Map();
    this.initializeDefaultData();
  }

  static getInstance(): MockCloudState {
    if (!MockCloudState.instance) {
      MockCloudState.instance = new MockCloudState();
    }
    return MockCloudState.instance;
  }

  /**
   * Reset all mock data
   */
  reset(): void {
    this.regions.clear();
    this.initializeDefaultData();
  }

  /**
   * Clear a specific region
   */
  clearRegion(region: string): void {
    this.regions.delete(region);
  }

  /**
   * Initialize with some default mock data for testing
   */
  private initializeDefaultData(): void {
    const defaultRegions = ["us-east-1", "us-west-2", "eu-west-1"];

    for (const region of defaultRegions) {
      this.initializeRegion(region);
    }
  }

  /**
   * Initialize a region with empty data structures
   */
  private initializeRegion(region: string): RegionData {
    const regionData: RegionData = {
      ec2: [],
      ecs: [],
      lambda: [],
      rds: [],
      s3: [],
    };
    this.regions.set(region, regionData);
    return regionData;
  }

  /**
   * Get or create region data
   */
  getRegionData(region: string): RegionData {
    return this.regions.get(region) || this.initializeRegion(region);
  }

  // ==================== EC2 Operations ====================

  createEC2(
    region: string,
    config: {
      instanceType?: string;
      state?: "running" | "stopped";
      tags?: Record<string, string>;
      isZombie?: boolean;
    }
  ): MockEC2Instance {
    const regionData = this.getRegionData(region);
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

    regionData.ec2.push(instance);
    return instance;
  }

  listEC2(region: string): MockEC2Instance[] {
    return this.getRegionData(region).ec2;
  }

  getEC2Metrics(instanceId: string, region: string): { cpu: number; networkIn: number; networkOut: number } | null {
    const instance = this.getRegionData(region).ec2.find((i) => i.InstanceId === instanceId);
    if (!instance) return null;
    return {
      cpu: instance.CpuUtilization,
      networkIn: instance.NetworkIn,
      networkOut: instance.NetworkOut,
    };
  }

  // ==================== ECS Operations ====================

  createECS(
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
  ): MockECSCluster {
    const regionData = this.getRegionData(region);
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

    regionData.ecs.push(cluster);
    return cluster;
  }

  listECS(region: string): MockECSCluster[] {
    return this.getRegionData(region).ecs;
  }

  // ==================== Lambda Operations ====================

  createLambda(
    region: string,
    config: {
      functionName: string;
      runtime?: string;
      memorySize?: number;
      isZombie?: boolean;
    }
  ): MockLambdaFunction {
    const regionData = this.getRegionData(region);

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

    regionData.lambda.push(func);
    return func;
  }

  listLambda(region: string): MockLambdaFunction[] {
    return this.getRegionData(region).lambda;
  }

  getLambdaMetrics(functionName: string, region: string): { invocations: number } | null {
    const func = this.getRegionData(region).lambda.find((f) => f.FunctionName === functionName);
    if (!func) return null;
    return { invocations: func.Invocations };
  }

  // ==================== RDS Operations ====================

  createRDS(
    region: string,
    config: {
      dbInstanceIdentifier: string;
      engine?: string;
      status?: "available" | "creating" | "deleting";
      isZombie?: boolean;
    }
  ): MockRDSInstance {
    const regionData = this.getRegionData(region);

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

    regionData.rds.push(instance);
    return instance;
  }

  listRDS(region: string): MockRDSInstance[] {
    return this.getRegionData(region).rds;
  }

  getRDSMetrics(dbInstanceIdentifier: string, region: string): { cpu: number; connections: number } | null {
    const instance = this.getRegionData(region).rds.find(
      (i) => i.DBInstanceIdentifier === dbInstanceIdentifier
    );
    if (!instance) return null;
    return {
      cpu: instance.CpuUtilization,
      connections: instance.Connections,
    };
  }

  // ==================== S3 Operations ====================

  createS3(
    region: string,
    config: {
      bucketName: string;
    }
  ): MockS3Bucket {
    const regionData = this.getRegionData(region);

    const bucket: MockS3Bucket = {
      Name: config.bucketName,
      CreationDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    };

    regionData.s3.push(bucket);
    return bucket;
  }

  listS3(region: string): MockS3Bucket[] {
    return this.getRegionData(region).s3;
  }
}
