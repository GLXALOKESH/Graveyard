import { ResourceIntelligence } from "../services/ResourceIntelligenceService.js";

export interface LambdaFunction {
  functionName: string;
  runtime: string;
  lastModified: string;
  memorySize?: number;
  intelligence?: ResourceIntelligence;
}

export interface ILambdaRepository {
  getFunctions(region: string): Promise<LambdaFunction[]>;
}
