import { RDSInstance } from "../interfaces/IRDSRepository.js";

export class RDSOverviewDTO {
  running: number;
  avgCpuUtilization: number;
  zombieScore: number;
  instances: RDSInstance[];
  totalMonthlyCost: number;

  constructor(
    running: number,
    avgCpuUtilization: number,
    zombieScore: number,
    instances: RDSInstance[] = [],
    totalMonthlyCost: number = 0
  ) {
    this.running = running;
    this.avgCpuUtilization = avgCpuUtilization;
    this.zombieScore = zombieScore;
    this.instances = instances;
    this.totalMonthlyCost = totalMonthlyCost;
  }
}
