import { IRegionRepository, Region } from "../../interfaces/IRegionRepository.js";

/**
 * MockRegionRepository - Simulates EC2 DescribeRegions
 * Implements IRegionRepository interface
 */
export class MockRegionRepository implements IRegionRepository {
  private mockRegions: Region[];

  constructor() {
    // Default mock regions
    this.mockRegions = [
      { regionName: "us-east-1", endpoint: "ec2.us-east-1.amazonaws.com" },
      { regionName: "us-east-2", endpoint: "ec2.us-east-2.amazonaws.com" },
      { regionName: "us-west-1", endpoint: "ec2.us-west-1.amazonaws.com" },
      { regionName: "us-west-2", endpoint: "ec2.us-west-2.amazonaws.com" },
      { regionName: "eu-west-1", endpoint: "ec2.eu-west-1.amazonaws.com" },
      { regionName: "eu-west-2", endpoint: "ec2.eu-west-2.amazonaws.com" },
      { regionName: "eu-central-1", endpoint: "ec2.eu-central-1.amazonaws.com" },
      { regionName: "ap-southeast-1", endpoint: "ec2.ap-southeast-1.amazonaws.com" },
    ];
  }

  /**
   * IRegionRepository implementation
   * Returns mock regions
   */
  async getAllRegions(): Promise<Region[]> {
    return [...this.mockRegions];
  }

  /**
   * Set custom mock regions
   */
  setMockRegions(regions: Region[]): void {
    this.mockRegions = regions;
  }

  /**
   * Add a mock region
   */
  addMockRegion(region: Region): void {
    this.mockRegions.push(region);
  }

  /**
   * Clear all mock regions
   */
  clearRegions(): void {
    this.mockRegions = [];
  }
}
