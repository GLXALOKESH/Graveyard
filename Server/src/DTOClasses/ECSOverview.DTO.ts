export class ECSOverviewDTO {
  services: number;
  runningTasks: number;
  zombieScore: number;

  constructor(services: number, runningTasks: number, zombieScore: number) {
    this.services = services;
    this.runningTasks = runningTasks;
    this.zombieScore = zombieScore;
  }
}
