import { EC2Instance } from "../interfaces/IInstanceRepository.js";

export class EC2OverviewDTO {
  running: number;
  avgCpuUtilization: number;
  zombieScore: number;
  instances: EC2Instance[];
  totalMonthlyCost: number;

  constructor(
    running: number,
    avgCpuUtilization: number,
    zombieScore: number,
    instances: EC2Instance[] = [],
    totalMonthlyCost: number = 0
  ) {
    this.running = running;
    this.avgCpuUtilization = avgCpuUtilization;
    this.zombieScore = zombieScore;
    this.instances = instances;
    this.totalMonthlyCost = totalMonthlyCost;
  }
}
