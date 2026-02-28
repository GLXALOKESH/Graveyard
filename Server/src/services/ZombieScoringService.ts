/**
 * ZombieScoringService
 *
 * Progressive, normalized, explainable zombie scoring for AWS resources.
 * All functions are pure and deterministic.
 */

// ==================== Type Definitions ====================

export interface EC2Metrics {
  cpu: number; // percentage
  networkIn: number; // bytes
  networkOut: number; // bytes
  hasTags: boolean;
  launchTime?: Date;
  instanceType: string;
}

export interface EC2InstanceWithMeta {
  instanceId: string;
  instanceType: string;
  tags: Record<string, string>;
  intelligence?: Intelligence;
}

export interface RDSMetrics {
  cpu: number; // percentage
  connections: number;
  hasTags: boolean;
  engine: string;
}

export interface LambdaMetrics {
  avgInvocations: number; // per day
  memorySize: number; // MB
}

export interface ECSMetrics {
  desiredCount: number;
  runningCount: number;
  hasTags: boolean;
}

export interface VolumeMetrics {
  status: "available" | "in-use" | string;
  sizeGb: number;
  ageDays?: number;
}

export interface S3Metrics {
  lastAccessed?: Date;
  sizeGb: number;
}

export interface Intelligence {
  status: "healthy" | "warning" | "suspect" | "likely zombie" | "zombie";
  confidence: number; // 0-100
  monthlyCost: number;
  breakdown: Record<string, number>;
}

export interface ScoreResult {
  score: number;
  monthlyCost: number;
  breakdown: Record<string, number>;
}

// ==================== Price Tables ====================

const EC2_PRICES: Record<string, number> = {
  "t3.micro": 8,
  "t3.small": 12,
  "t3.medium": 24,
  "t3.large": 60,
  "t3.xlarge": 120,
  "t3.2xlarge": 240,
  "t2.micro": 8,
  "t2.small": 12,
  "t2.medium": 24,
  "t2.large": 48,
  "m5.large": 70,
  "m5.xlarge": 140,
  "m5.2xlarge": 280,
  "c5.large": 62,
  "c5.xlarge": 124,
  "r5.large": 90,
  "r5.xlarge": 180,
};

const RDS_PRICES: Record<string, number> = {
  postgres: 120,
  mysql: 100,
  mariadb: 100,
  oracle: 200,
  sqlserver: 250,
};

// ==================== Helper Functions ====================

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const round = (value: number): number => Math.round(value);

const getEC2Price = (instanceType: string): number => {
  const normalized = instanceType.toLowerCase().trim();
  return EC2_PRICES[normalized] ?? 20; // fallback
};

const getRDSPrice = (engine: string): number => {
  const normalized = engine.toLowerCase();
  for (const [key, price] of Object.entries(RDS_PRICES)) {
    if (normalized.includes(key)) return price;
  }
  return 110; // default
};

const getLambdaPrice = (memorySize: number): number => {
  const basePrice = 5;
  const baseMemory = 128;
  return round((memorySize / baseMemory) * basePrice);
};

const getStatusFromConfidence = (confidence: number): Intelligence["status"] => {
  if (confidence >= 81) return "zombie";
  if (confidence >= 61) return "likely zombie";
  if (confidence >= 41) return "suspect";
  if (confidence >= 21) return "warning";
  return "healthy";
};

// ==================== Scoring Functions ====================

/**
 * Calculate EC2 instance zombie score (0-100)
 */
export const calcEC2Score = (metrics: EC2Metrics): ScoreResult => {
  const breakdown: Record<string, number> = {};

  // CPU contribution (max 40)
  if (metrics.cpu < 2) breakdown.cpu = 40;
  else if (metrics.cpu < 5) breakdown.cpu = 30;
  else if (metrics.cpu < 10) breakdown.cpu = 20;
  else if (metrics.cpu < 20) breakdown.cpu = 10;
  else breakdown.cpu = 0;

  // Network contribution (max 30)
  const net = metrics.networkIn + metrics.networkOut;
  if (net < 1024) breakdown.network = 30;
  else if (net < 10240) breakdown.network = 20;
  else if (net < 51200) breakdown.network = 10;
  else breakdown.network = 0;

  // Tags contribution (max 20)
  breakdown.tags = metrics.hasTags ? 0 : 20;

  // Age contribution (optional max 10)
  breakdown.age = 0;
  if (metrics.launchTime) {
    const ageDays =
      (Date.now() - metrics.launchTime.getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > 180 && metrics.cpu < 5 && net < 1024) {
      breakdown.age = 10;
    }
  }

  const score = clamp(
    breakdown.cpu + breakdown.network + breakdown.tags + breakdown.age,
    0,
    100
  );
  const monthlyCost = getEC2Price(metrics.instanceType);

  return { score: round(score), monthlyCost, breakdown };
};

/**
 * Calculate RDS instance zombie score (0-100)
 */
export const calcRDSScore = (metrics: RDSMetrics): ScoreResult => {
  const breakdown: Record<string, number> = {};

  // CPU contribution (max 50)
  if (metrics.cpu < 5) breakdown.cpu = 50;
  else if (metrics.cpu < 10) breakdown.cpu = 30;
  else breakdown.cpu = 0;

  // Connections contribution (max 30)
  if (metrics.connections === 0) breakdown.connections = 30;
  else if (metrics.connections < 5) breakdown.connections = 15;
  else breakdown.connections = 0;

  // Tags contribution (max 20)
  breakdown.tags = metrics.hasTags ? 0 : 20;

  const score = clamp(breakdown.cpu + breakdown.connections + breakdown.tags, 0, 100);
  const monthlyCost = getRDSPrice(metrics.engine);

  return { score: round(score), monthlyCost, breakdown };
};

/**
 * Calculate Lambda function zombie score (0-100)
 */
export const calcLambdaScore = (metrics: LambdaMetrics): ScoreResult => {
  const breakdown: Record<string, number> = {};

  // Invocations contribution (max 60)
  if (metrics.avgInvocations === 0) breakdown.invocations = 60;
  else if (metrics.avgInvocations < 5) breakdown.invocations = 40;
  else if (metrics.avgInvocations < 20) breakdown.invocations = 20;
  else breakdown.invocations = 0;

  // Memory underutilization (max 20)
  breakdown.memory = 0;
  if (metrics.avgInvocations < 5) {
    if (metrics.memorySize >= 512) breakdown.memory = 20;
    else if (metrics.memorySize >= 256) breakdown.memory = 10;
  }

  const score = clamp(breakdown.invocations + breakdown.memory, 0, 100);
  const monthlyCost = getLambdaPrice(metrics.memorySize);

  return { score: round(score), monthlyCost, breakdown };
};

/**
 * Calculate ECS service zombie score (0-100)
 */
export const calcECSScore = (metrics: ECSMetrics): ScoreResult => {
  const breakdown: Record<string, number> = {};

  // Desired/running mismatch (max 50)
  if (metrics.desiredCount > 0 && metrics.runningCount === 0) {
    breakdown.mismatch = 50;
  } else if (metrics.runningCount < metrics.desiredCount) {
    breakdown.mismatch = 25;
  } else {
    breakdown.mismatch = 0;
  }

  // Tags contribution (max 10)
  breakdown.tags = metrics.hasTags ? 0 : 10;

  const score = clamp(breakdown.mismatch + breakdown.tags, 0, 100);
  const monthlyCost = metrics.runningCount * 30;

  return { score: round(score), monthlyCost, breakdown };
};

/**
 * Calculate EBS volume zombie score (0-100)
 */
export const calcVolumeScore = (metrics: VolumeMetrics): ScoreResult => {
  const breakdown: Record<string, number> = {};

  // Status contribution (max 70)
  breakdown.status = metrics.status === "available" ? 70 : 0;

  // Age contribution (max 30)
  breakdown.age =
    metrics.ageDays && metrics.ageDays > 30 && metrics.status === "available"
      ? 30
      : 0;

  const score = clamp(breakdown.status + breakdown.age, 0, 100);
  const monthlyCost = round(metrics.sizeGb * 0.1);

  return { score: round(score), monthlyCost, breakdown };
};

/**
 * Calculate S3 bucket zombie score (0-100) - optional
 */
export const calcS3Score = (metrics: S3Metrics): ScoreResult => {
  const breakdown: Record<string, number> = {};

  // Last access contribution (max 40)
  if (metrics.lastAccessed) {
    const daysSinceAccess =
      (Date.now() - metrics.lastAccessed.getTime()) / (1000 * 60 * 60 * 24);
    breakdown.access = daysSinceAccess > 90 ? 40 : 0;
  } else {
    breakdown.access = 20; // unknown access
  }

  const score = clamp(breakdown.access, 0, 100);
  const monthlyCost = round(metrics.sizeGb * 0.02);

  return { score: round(score), monthlyCost, breakdown };
};

// ==================== Aggregation Functions ====================

/**
 * Calculate resource-level score from instances using cost-weighted mean
 */
export const resourceScoreFromInstances = (
  instances: Array<{ score: number; monthlyCost: number }>
): number => {
  if (instances.length === 0) return 0;

  const totalCost = instances.reduce((sum, i) => sum + i.monthlyCost, 0);

  if (totalCost > 0) {
    const weightedSum = instances.reduce(
      (sum, i) => sum + i.score * i.monthlyCost,
      0
    );
    return round(weightedSum / totalCost);
  }

  // Arithmetic mean if no cost data
  const sum = instances.reduce((acc, i) => acc + i.score, 0);
  return round(sum / instances.length);
};

/**
 * Calculate region-level score with zombie-density risk boost
 */
export const calculateRegionScore = (
  resourceScores: number[],
  instanceScoresFlat: number[]
): number => {
  if (resourceScores.length === 0) return 0;

  const mean =
    resourceScores.reduce((sum, s) => sum + s, 0) / resourceScores.length;

  const zombieInstances = instanceScoresFlat.filter((s) => s >= 60).length;
  const halfInstances = instanceScoresFlat.length / 2;

  if (zombieInstances > halfInstances) {
    return clamp(round(mean + 10), 0, 100);
  }

  return round(mean);
};

/**
 * Calculate overall account score with global risk boost
 */
export const calculateOverallScore = (regionScores: number[]): number => {
  if (regionScores.length === 0) return 0;

  const avg =
    regionScores.reduce((sum, s) => sum + s, 0) / regionScores.length;
  const badRegions = regionScores.filter((s) => s >= 60).length;

  if (badRegions > regionScores.length / 2) {
    return clamp(round(avg + 5), 0, 100);
  }

  return round(avg);
};

// ==================== Intelligence Helpers ====================

/**
 * Create intelligence object from score result
 */
export const toIntelligence = (result: ScoreResult): Intelligence => ({
  status: getStatusFromConfidence(result.score),
  confidence: result.score,
  monthlyCost: result.monthlyCost,
  breakdown: result.breakdown,
});

/**
 * Attach intelligence to EC2 instance
 */
export const attachEC2Intelligence = (
  instance: EC2InstanceWithMeta,
  metrics: EC2Metrics
): void => {
  const result = calcEC2Score(metrics);
  instance.intelligence = toIntelligence(result);
};

/**
 * Human-readable explanation of score breakdown (for tests/debugging)
 */
export const explain = (result: ScoreResult): string => {
  const parts = Object.entries(result.breakdown)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${k}: +${v}`);
  return `Score: ${result.score}/100 (${parts.join(", ")})`;
};

// ==================== Backward Compatible Class Wrapper ====================

/**
 * Legacy interface metrics (for backward compatibility)
 */
export interface LegacyEC2Metrics {
  avgCpuUtilization: number;
  networkTraffic: number;
  hasTags: boolean;
}

export interface LegacyRDSMetrics {
  avgCpuUtilization: number;
  connections: number;
}

export interface LegacyLambdaMetrics {
  avgInvocations: number;
}

export interface LegacyECSMetrics {
  runningTasks: number;
  desiredCount: number;
}

/**
 * ZombieScoringService class (backward compatible wrapper)
 * Uses the new pure functions internally
 */
export class ZombieScoringService {
  calculateEC2ZombieScore(metrics: LegacyEC2Metrics): number {
    const result = calcEC2Score({
      cpu: metrics.avgCpuUtilization,
      networkIn: metrics.networkTraffic,
      networkOut: 0,
      hasTags: metrics.hasTags,
      instanceType: "t3.micro", // default for legacy
    });
    return result.score;
  }

  calculateRDSZombieScore(metrics: LegacyRDSMetrics): number {
    const result = calcRDSScore({
      cpu: metrics.avgCpuUtilization,
      connections: metrics.connections,
      hasTags: true, // assume tagged for legacy
      engine: "postgres", // default for legacy
    });
    return result.score;
  }

  calculateLambdaZombieScore(metrics: LegacyLambdaMetrics): number {
    const result = calcLambdaScore({
      avgInvocations: metrics.avgInvocations,
      memorySize: 128, // default for legacy
    });
    return result.score;
  }

  calculateECSZombieScore(metrics: LegacyECSMetrics): number {
    const result = calcECSScore({
      desiredCount: metrics.desiredCount,
      runningCount: metrics.runningTasks,
      hasTags: true, // assume tagged for legacy
    });
    return result.score;
  }

  calculateRegionZombieScore(scores: number[]): number {
    return calculateRegionScore(scores, scores);
  }

  calculateOverallZombieScore(regionScores: number[]): number {
    return calculateOverallScore(regionScores);
  }
}
