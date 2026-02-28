import { ECSService } from "../interfaces/IEcsRepository.js";

export class ECSOverviewDTO {
  services: number;
  runningTasks: number;
  zombieScore: number;
  servicesList: ECSService[];
  totalMonthlyCost: number;

  constructor(
    services: number,
    runningTasks: number,
    zombieScore: number,
    servicesList: ECSService[] = [],
    totalMonthlyCost: number = 0
  ) {
    this.services = services;
    this.runningTasks = runningTasks;
    this.zombieScore = zombieScore;
    this.servicesList = servicesList;
    this.totalMonthlyCost = totalMonthlyCost;
  }
}
