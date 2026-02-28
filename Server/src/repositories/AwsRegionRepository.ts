import { EC2Client, DescribeRegionsCommand } from "@aws-sdk/client-ec2";
import {
  IRegionRepository,
  Region,
} from "../interfaces/IRegionRepository.js";
import { createEC2Client } from "../configs/awsClientFactory.js";

export class AwsRegionRepository implements IRegionRepository {
  private ec2Client: EC2Client;

  constructor() {
    this.ec2Client = this.createEC2Client();
  }

  protected createEC2Client(): EC2Client {
    return createEC2Client();
  }

  async getAllRegions(): Promise<Region[]> {
    const command = new DescribeRegionsCommand({});
    const response = await this.ec2Client.send(command);

    const regions: Region[] = [];

    if (response.Regions) {
      for (const region of response.Regions) {
        if (region.RegionName) {
          regions.push({
            regionName: region.RegionName,
            endpoint: region.Endpoint || "",
          });
        }
      }
    }

    return regions;
  }
}
