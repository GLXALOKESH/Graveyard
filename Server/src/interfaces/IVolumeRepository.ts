import { ResourceIntelligence } from "../services/ResourceIntelligenceService.js";

export interface Volume {
  volumeId: string;
  status: "available" | "in-use" | string;
  size: number;
  intelligence?: ResourceIntelligence;
}

export interface IVolumeRepository {
  countUnattachedVolumes(region: string): Promise<number>;
  getVolumes(region: string): Promise<Volume[]>;
}
