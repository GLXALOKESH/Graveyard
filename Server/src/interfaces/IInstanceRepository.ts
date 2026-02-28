import { ResourceIntelligence } from "../services/ResourceIntelligenceService.js";

export interface EC2Instance {
  instanceId: string;
  instanceType: string;
  tags: Record<string, string>;
  intelligence?: ResourceIntelligence;
}

export interface IInstanceRepository {
  countRunningInstances(region: string): Promise<number>;
  getRunningInstances(region: string): Promise<EC2Instance[]>;
}
