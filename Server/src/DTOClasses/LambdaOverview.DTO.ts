import { LambdaFunction } from "../interfaces/ILambdaRepository.js";

export class LambdaOverviewDTO {
  functions: number;
  avgInvocations: number;
  zombieScore: number;
  functionsList: LambdaFunction[];
  totalMonthlyCost: number;

  constructor(
    functions: number,
    avgInvocations: number,
    zombieScore: number,
    functionsList: LambdaFunction[] = [],
    totalMonthlyCost: number = 0
  ) {
    this.functions = functions;
    this.avgInvocations = avgInvocations;
    this.zombieScore = zombieScore;
    this.functionsList = functionsList;
    this.totalMonthlyCost = totalMonthlyCost;
  }
}
