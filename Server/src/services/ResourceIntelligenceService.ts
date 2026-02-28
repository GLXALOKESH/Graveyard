/**
 * ResourceIntelligenceService
 *
 * Calculates intelligence metadata (zombie status, confidence, monthly cost)
 * for AWS resources based on their metrics and properties.
 *
 * This service is provider-agnostic and works with both real AWS and mock data.
 */

export interface ResourceIntelligence {
  status: "healthy" | "zombie";
  confidence: number;
  monthlyCost: number;
}

// EC2 specific interfaces
export interface EC2ResourceMetrics {
  instanceType: string;
  avgCpuUtilization: number;
  networkIn: number;
  networkOut: number;
  hasTags: boolean;
}

// RDS specific interfaces
export interface RDSResourceMetrics {
  engine: string;
  avgCpuUtilization: number;
  connections: number;
}

// Lambda specific interfaces
export interface LambdaResourceMetrics {
  memorySize: number;
  avgInvocations: number;
}

// ECS specific interfaces
export interface ECSResourceMetrics {
  runningCount: number;
  desiredCount: number;
}

// Volume specific interfaces
export interface VolumeResourceMetrics {
  status: "available" | "in-use" | string;
  sizeGb: number;
}

// S3 specific interfaces
export interface S3ResourceMetrics {
  bucketName: string;
  lastAccessed?: Date;
  sizeGb?: number;
}

export class ResourceIntelligenceService {
  // ==================== EC2 Intelligence ====================

  calculateEC2Intelligence(metrics: EC2ResourceMetrics): ResourceIntelligence {
    const score = this.calculateEC2ZombieScore(metrics);
    const monthlyCost = this.calculateEC2Cost(metrics.instanceType);

    return {
      status: score >= 60 ? "zombie" : "healthy",
      confidence: score,
      monthlyCost,
    };
  }

  private calculateEC2ZombieScore(metrics: EC2ResourceMetrics): number {
    let score = 0;

    // CPU Utilization Score (max 40 points)
    if (metrics.avgCpuUtilization < 2) {
      score += 40;
    }

    // Network Traffic Score (max 30 points)
    const totalNetwork = metrics.networkIn + metrics.networkOut;
    if (totalNetwork < 1000) {
      // Less than 1KB
      score += 30;
    }

    // Tags Score (max 10 points)
    if (!metrics.hasTags) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  private calculateEC2Cost(instanceType: string): number {
    // Map common instance types to monthly costs
    const costMap: Record<string, number> = {
      "t3.micro": 8,
      "t3.small": 15,
      "t3.medium": 30,
      "t3.large": 60,
      "t3.xlarge": 120,
      "t3.2xlarge": 240,
      "t2.micro": 8,
      "t2.small": 16,
      "t2.medium": 34,
      "t2.large": 68,
      "m5.large": 70,
      "m5.xlarge": 140,
      "m5.2xlarge": 280,
      "c5.large": 62,
      "c5.xlarge": 124,
      "c5.2xlarge": 248,
      "r5.large": 90,
      "r5.xlarge": 180,
      "r5.2xlarge": 360,
    };

    const normalizedType = instanceType.toLowerCase().trim();
    return costMap[normalizedType] ?? this.randomBetween(10, 100);
  }

  // ==================== RDS Intelligence ====================

  calculateRDSIntelligence(metrics: RDSResourceMetrics): ResourceIntelligence {
    const score = this.calculateRDSZombieScore(metrics);
    const monthlyCost = this.calculateRDSCost(metrics.engine);

    return {
      status: score >= 60 ? "zombie" : "healthy",
      confidence: score,
      monthlyCost,
    };
  }

  private calculateRDSZombieScore(metrics: RDSResourceMetrics): number {
    let score = 0;

    // CPU Utilization Score (max 50 points)
    if (metrics.avgCpuUtilization < 5) {
      score += 50;
    }

    // Connections Score (max 30 points)
    if (metrics.connections < 2) {
      score += 30;
    }

    return Math.min(score, 100);
  }

  private calculateRDSCost(engine: string): number {
    const normalizedEngine = engine.toLowerCase();
    if (normalizedEngine.includes("postgres")) {
      return 120;
    }
    if (normalizedEngine.includes("mysql") || normalizedEngine.includes("mariadb")) {
      return 100;
    }
    if (normalizedEngine.includes("oracle")) {
      return 200;
    }
    if (normalizedEngine.includes("sqlserver")) {
      return 250;
    }
    return 110; // Default for other engines
  }

  // ==================== Lambda Intelligence ====================

  calculateLambdaIntelligence(metrics: LambdaResourceMetrics): ResourceIntelligence {
    const score = this.calculateLambdaZombieScore(metrics);
    const monthlyCost = this.calculateLambdaCost(metrics.memorySize);

    return {
      status: score >= 60 ? "zombie" : "healthy",
      confidence: score,
      monthlyCost,
    };
  }

  private calculateLambdaZombieScore(metrics: LambdaResourceMetrics): number {
    let score = 0;

    // Invocations Score (max 60 points)
    if (metrics.avgInvocations < 5) {
      score += 60;
    }

    // Memory underutilization (max 20 points)
    if (metrics.memorySize > 512 && metrics.avgInvocations < 10) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  private calculateLambdaCost(memorySize: number): number {
    // Base cost at 128MB = $5/month, scales proportionally
    const baseMemory = 128;
    const baseCost = 5;
    return Math.round((memorySize / baseMemory) * baseCost);
  }

  // ==================== ECS Intelligence ====================

  calculateECSIntelligence(metrics: ECSResourceMetrics): ResourceIntelligence {
    const score = this.calculateECSZombieScore(metrics);
    const monthlyCost = this.calculateECSCost(metrics.runningCount);

    return {
      status: score >= 50 ? "zombie" : "healthy",
      confidence: score,
      monthlyCost,
    };
  }

  private calculateECSZombieScore(metrics: ECSResourceMetrics): number {
    let score = 0;

    // Task mismatch Score (max 50 points)
    if (metrics.desiredCount > 0 && metrics.runningCount === 0) {
      score += 50;
    }

    return Math.min(score, 100);
  }

  private calculateECSCost(runningTasks: number): number {
    // $30 per running task per month
    return runningTasks * 30;
  }

  // ==================== Volume Intelligence ====================

  calculateVolumeIntelligence(metrics: VolumeResourceMetrics): ResourceIntelligence {
    const score = this.calculateVolumeZombieScore(metrics);
    const monthlyCost = this.calculateVolumeCost(metrics.sizeGb);

    return {
      status: score >= 70 ? "zombie" : "healthy",
      confidence: score,
      monthlyCost,
    };
  }

  private calculateVolumeZombieScore(metrics: VolumeResourceMetrics): number {
    let score = 0;

    // Available (unattached) volume Score (max 70 points)
    if (metrics.status === "available") {
      score += 70;
    }

    return Math.min(score, 100);
  }

  private calculateVolumeCost(sizeGb: number): number {
    // $0.10 per GB per month
    return Math.round(sizeGb * 0.1);
  }

  // ==================== S3 Intelligence ====================

  calculateS3Intelligence(metrics: S3ResourceMetrics): ResourceIntelligence {
    const score = this.calculateS3ZombieScore(metrics);
    const monthlyCost = this.calculateS3Cost(metrics.sizeGb ?? 100);

    return {
      status: score >= 40 ? "zombie" : "healthy",
      confidence: score,
      monthlyCost,
    };
  }

  private calculateS3ZombieScore(metrics: S3ResourceMetrics): number {
    let score = 0;

    // No recent access Score (max 40 points)
    if (metrics.lastAccessed) {
      const daysSinceAccess =
        (Date.now() - metrics.lastAccessed.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceAccess > 90) {
        score += 40;
      }
    } else {
      // No access data available - assume potential zombie
      score += 20;
    }

    return Math.min(score, 100);
  }

  private calculateS3Cost(sizeGb: number): number {
    // $0.02 per GB per month (simplified)
    return Math.round(sizeGb * 0.02);
  }

  // ==================== Helper Methods ====================

  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
