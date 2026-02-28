export interface EC2Metrics {
  avgCpuUtilization: number;
  networkTraffic: number;
  hasTags: boolean;
}

export interface RDSMetrics {
  avgCpuUtilization: number;
  connections: number;
}

export interface LambdaMetrics {
  avgInvocations: number;
}

export interface ECSMetrics {
  runningTasks: number;
  desiredCount: number;
}

export class ZombieScoringService {
  calculateEC2ZombieScore(metrics: EC2Metrics): number {
    let score = 0;

    if (metrics.avgCpuUtilization < 2) {
      score += 40;
    }

    if (metrics.networkTraffic < 1000) {
      score += 30;
    }

    if (!metrics.hasTags) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  calculateRDSZombieScore(metrics: RDSMetrics): number {
    let score = 0;

    if (metrics.avgCpuUtilization < 5) {
      score += 50;
    }

    if (metrics.connections < 1) {
      score += 30;
    }

    return Math.min(score, 100);
  }

  calculateLambdaZombieScore(metrics: LambdaMetrics): number {
    let score = 0;

    if (metrics.avgInvocations === 0) {
      score += 60;
    }

    return Math.min(score, 100);
  }

  calculateECSZombieScore(metrics: ECSMetrics): number {
    let score = 0;

    if (metrics.desiredCount > 0 && metrics.runningTasks === 0) {
      score += 50;
    }

    return Math.min(score, 100);
  }

  calculateRegionZombieScore(scores: number[]): number {
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, score) => acc + score, 0);
    return Math.round(sum / scores.length);
  }

  calculateOverallZombieScore(regionScores: number[]): number {
    if (regionScores.length === 0) return 0;
    const sum = regionScores.reduce((acc, score) => acc + score, 0);
    return Math.round(sum / regionScores.length);
  }
}
