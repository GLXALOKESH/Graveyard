export class RDSOverviewDTO {
  running: number;
  avgCpuUtilization: number;
  zombieScore: number;

  constructor(running: number, avgCpuUtilization: number, zombieScore: number) {
    this.running = running;
    this.avgCpuUtilization = avgCpuUtilization;
    this.zombieScore = zombieScore;
  }
}
