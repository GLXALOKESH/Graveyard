import { ResourceIntelligence } from "../services/ResourceIntelligenceService.js";

export interface RDSInstance {
  dbInstanceIdentifier: string;
  dbInstanceStatus: string;
  engine: string;
  intelligence?: ResourceIntelligence;
}

export interface IRDSRepository {
  getRunningInstances(region: string): Promise<RDSInstance[]>;
}
