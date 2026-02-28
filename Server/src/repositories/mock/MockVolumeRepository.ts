import { IVolumeRepository, Volume } from "../../interfaces/IVolumeRepository.js";
import { MockCloudState } from "./MockCloudState.js";

// Volume interface for mock storage
interface MockVolume {
  volumeId: string;
  region: string;
  status: "available" | "in-use" | "creating" | "deleting";
  size: number;
}

/**
 * MockVolumeRepository - Simulates EC2 EBS volumes
 * Implements IVolumeRepository interface
 */
export class MockVolumeRepository implements IVolumeRepository {
  private state: MockCloudState;
  private volumes: Map<string, MockVolume[]>; // region -> volumes

  constructor() {
    this.state = MockCloudState.getInstance();
    this.volumes = new Map();
    this.initializeDefaultVolumes();
  }

  /**
   * Initialize with some default mock volumes
   */
  private initializeDefaultVolumes(): void {
    // Create some unattached volumes for testing
    const regions = ["us-east-1", "us-west-2", "eu-west-1"];
    
    for (const region of regions) {
      const regionVolumes: MockVolume[] = [];
      
      // Add 1-3 unattached volumes per region
      const unattachedCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < unattachedCount; i++) {
        regionVolumes.push({
          volumeId: `vol-${Math.random().toString(36).substring(2, 10)}`,
          region,
          status: "available",
          size: Math.floor(Math.random() * 100) + 10,
        });
      }
      
      this.volumes.set(region, regionVolumes);
    }
  }

  /**
   * IVolumeRepository implementation
   * Count unattached (available) volumes
   */
  async countUnattachedVolumes(region: string): Promise<number> {
    const regionVolumes = this.volumes.get(region) || [];
    return regionVolumes.filter((v) => v.status === "available").length;
  }

  /**
   * Create a mock volume
   */
  createVolume(
    region: string,
    config: {
      status?: "available" | "in-use" | "creating" | "deleting";
      size?: number;
    }
  ): MockVolume {
    const regionVolumes = this.volumes.get(region) || [];
    
    const volume: MockVolume = {
      volumeId: `vol-${Math.random().toString(36).substring(2, 10)}`,
      region,
      status: config.status || "available",
      size: config.size || Math.floor(Math.random() * 100) + 10,
    };
    
    regionVolumes.push(volume);
    this.volumes.set(region, regionVolumes);
    
    return volume;
  }

  /**
   * List all volumes in a region
   */
  listVolumes(region: string): MockVolume[] {
    return this.volumes.get(region) || [];
  }

  /**
   * IVolumeRepository implementation - Get volumes with intelligence support
   */
  async getVolumes(region: string): Promise<Volume[]> {
    const mockVolumes = this.volumes.get(region) || [];
    return mockVolumes.map((v) => ({
      volumeId: v.volumeId,
      status: v.status,
      size: v.size,
    }));
  }

  /**
   * Reset all volumes
   */
  reset(): void {
    this.volumes.clear();
    this.initializeDefaultVolumes();
  }

  /**
   * Clear volumes for a specific region
   */
  clearRegion(region: string): void {
    this.volumes.delete(region);
  }
}
