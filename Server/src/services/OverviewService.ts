import { Redis } from "ioredis";
import { IAccountRepository } from "../interfaces/IAccountRepository.js";
import { IRegionRepository } from "../interfaces/IRegionRepository.js";
import { IInstanceRepository } from "../interfaces/IInstanceRepository.js";
import { IRDSRepository } from "../interfaces/IRDSRepository.js";
import { IEcsRepository } from "../interfaces/IEcsRepository.js";
import { ILambdaRepository } from "../interfaces/ILambdaRepository.js";
import { ICloudWatchRepository } from "../interfaces/ICloudWatchRepository.js";
import { OverviewDTO } from "../DTOClasses/Overview.DTO.js";
import { RegionOverviewDTO } from "../DTOClasses/RegionOverview.DTO.js";
import { EC2OverviewDTO } from "../DTOClasses/EC2Overview.DTO.js";
import { RDSOverviewDTO } from "../DTOClasses/RDSOverview.DTO.js";
import { ECSOverviewDTO } from "../DTOClasses/ECSOverview.DTO.js";
import { LambdaOverviewDTO } from "../DTOClasses/LambdaOverview.DTO.js";
import { ZombieScoringService } from "./ZombieScoringService.js";

const CACHE_KEY = "account:overview";
const CACHE_TTL = 300;

export class OverviewService {
  constructor(
    private accountRepository: IAccountRepository,
    private regionRepository: IRegionRepository,
    private instanceRepository: IInstanceRepository,
    private rdsRepository: IRDSRepository,
    private ecsRepository: IEcsRepository,
    private lambdaRepository: ILambdaRepository,
    private cloudWatchRepository: ICloudWatchRepository,
    private zombieScoringService: ZombieScoringService,
    private redisClient: Redis
  ) {}

  async getOverview(refresh: boolean = false): Promise<OverviewDTO> {
    if (!refresh) {
      const cached = await this.getCachedOverview();
      if (cached) {
        return cached;
      }
    } else {
      await this.clearCache();
    }

    const overview = await this.generateOverview();
    await this.cacheOverview(overview);
    return overview;
  }

  private async getCachedOverview(): Promise<OverviewDTO | null> {
    try {
      const cached = await this.redisClient.get(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached) as OverviewDTO;
      }
    } catch (error) {
      console.error("Redis get error:", error);
    }
    return null;
  }

  private async cacheOverview(overview: OverviewDTO): Promise<void> {
    try {
      await this.redisClient.setex(
        CACHE_KEY,
        CACHE_TTL,
        JSON.stringify(overview)
      );
    } catch (error) {
      console.error("Redis set error:", error);
    }
  }

  private async clearCache(): Promise<void> {
    try {
      await this.redisClient.del(CACHE_KEY);
    } catch (error) {
      console.error("Redis del error:", error);
    }
  }

  private async generateOverview(): Promise<OverviewDTO> {
    const accountInfo = await this.accountRepository.getAccountInfo();
    const regions = await this.regionRepository.getAllRegions();

    const regionOverviews = await Promise.all(
      regions.map(async (region) => this.scanRegion(region.regionName))
    );

    const overallZombieScore =
      this.zombieScoringService.calculateOverallZombieScore(
        regionOverviews.map((r) => r.regionZombieScore)
      );

    return new OverviewDTO(
      accountInfo.accountId,
      accountInfo.userArn,
      overallZombieScore,
      regionOverviews
    );
  }

  private async scanRegion(region: string): Promise<RegionOverviewDTO> {
    const [ec2Overview, rdsOverview, ecsOverview, lambdaOverview] =
      await Promise.all([
        this.scanEC2(region),
        this.scanRDS(region),
        this.scanECS(region),
        this.scanLambda(region),
      ]);

    const allScores = [
      ec2Overview.zombieScore,
      rdsOverview.zombieScore,
      ecsOverview.zombieScore,
      lambdaOverview.zombieScore,
    ];

    const regionZombieScore =
      this.zombieScoringService.calculateRegionZombieScore(allScores);

    return new RegionOverviewDTO(
      region,
      ec2Overview,
      rdsOverview,
      ecsOverview,
      lambdaOverview,
      regionZombieScore
    );
  }

  private async scanEC2(region: string): Promise<EC2OverviewDTO> {
    const instances = await this.instanceRepository.getRunningInstances(region);

    if (instances.length === 0) {
      return new EC2OverviewDTO(0, 0, 0);
    }

    let totalCpu = 0;
    let totalNetwork = 0;
    let totalScore = 0;

    const instanceMetrics = await Promise.all(
      instances.map(async (instance) => {
        const [cpu, network] = await Promise.all([
          this.cloudWatchRepository.getEC2CPUUtilization(
            region,
            instance.instanceId
          ),
          this.cloudWatchRepository.getEC2NetworkTraffic(
            region,
            instance.instanceId
          ),
        ]);

        const hasTags = Object.keys(instance.tags).length > 0;
        const score = this.zombieScoringService.calculateEC2ZombieScore({
          avgCpuUtilization: cpu,
          networkTraffic: network,
          hasTags,
        });

        return { cpu, network, score };
      })
    );

    for (const metrics of instanceMetrics) {
      totalCpu += metrics.cpu;
      totalNetwork += metrics.network;
      totalScore += metrics.score;
    }

    const avgCpu = totalCpu / instances.length;
    const avgZombieScore = Math.round(totalScore / instances.length);

    return new EC2OverviewDTO(instances.length, avgCpu, avgZombieScore);
  }

  private async scanRDS(region: string): Promise<RDSOverviewDTO> {
    const instances = await this.rdsRepository.getRunningInstances(region);

    if (instances.length === 0) {
      return new RDSOverviewDTO(0, 0, 0);
    }

    let totalCpu = 0;
    let totalScore = 0;

    const instanceMetrics = await Promise.all(
      instances.map(async (instance) => {
        const [cpu, connections] = await Promise.all([
          this.cloudWatchRepository.getRDSCPUUtilization(
            region,
            instance.dbInstanceIdentifier
          ),
          this.cloudWatchRepository.getRDSConnections(
            region,
            instance.dbInstanceIdentifier
          ),
        ]);

        const score = this.zombieScoringService.calculateRDSZombieScore({
          avgCpuUtilization: cpu,
          connections,
        });

        return { cpu, score };
      })
    );

    for (const metrics of instanceMetrics) {
      totalCpu += metrics.cpu;
      totalScore += metrics.score;
    }

    const avgCpu = totalCpu / instances.length;
    const avgZombieScore = Math.round(totalScore / instances.length);

    return new RDSOverviewDTO(instances.length, avgCpu, avgZombieScore);
  }

  private async scanECS(region: string): Promise<ECSOverviewDTO> {
    const clusters = await this.ecsRepository.getClusters(region);

    let totalServices = 0;
    let totalRunningTasks = 0;
    let totalScore = 0;
    let serviceCount = 0;

    for (const cluster of clusters) {
      const services = await this.ecsRepository.getServices(
        region,
        cluster.clusterArn
      );

      totalServices += services.length;
      totalRunningTasks += cluster.runningTasksCount;

      for (const service of services) {
        const score = this.zombieScoringService.calculateECSZombieScore({
          runningTasks: service.runningCount,
          desiredCount: service.desiredCount,
        });
        totalScore += score;
        serviceCount++;
      }
    }

    const avgZombieScore =
      serviceCount > 0 ? Math.round(totalScore / serviceCount) : 0;

    return new ECSOverviewDTO(totalServices, totalRunningTasks, avgZombieScore);
  }

  private async scanLambda(region: string): Promise<LambdaOverviewDTO> {
    const functions = await this.lambdaRepository.getFunctions(region);

    if (functions.length === 0) {
      return new LambdaOverviewDTO(0, 0, 0);
    }

    let totalInvocations = 0;
    let totalScore = 0;

    const functionMetrics = await Promise.all(
      functions.map(async (func) => {
        const invocations = await this.cloudWatchRepository.getLambdaInvocations(
          region,
          func.functionName
        );

        const score = this.zombieScoringService.calculateLambdaZombieScore({
          avgInvocations: invocations,
        });

        return { invocations, score };
      })
    );

    for (const metrics of functionMetrics) {
      totalInvocations += metrics.invocations;
      totalScore += metrics.score;
    }

    const avgInvocations = totalInvocations / functions.length;
    const avgZombieScore = Math.round(totalScore / functions.length);

    return new LambdaOverviewDTO(
      functions.length,
      avgInvocations,
      avgZombieScore
    );
  }
}
