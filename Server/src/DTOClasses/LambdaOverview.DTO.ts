export class LambdaOverviewDTO {
  functions: number;
  avgInvocations: number;
  zombieScore: number;

  constructor(
    functions: number,
    avgInvocations: number,
    zombieScore: number
  ) {
    this.functions = functions;
    this.avgInvocations = avgInvocations;
    this.zombieScore = zombieScore;
  }
}
