import { EC2Client, DescribeRegionsCommand } from "@aws-sdk/client-ec2";
import {
  IRegionRepository,
  Region,
} from "../interfaces/IRegionRepository.js";
import { createEC2Client } from "../configs/awsClientFactory.js";

export class AwsRegionRepository implements IRegionRepository {
  private ec2Client: EC2Client | null = null;

  protected getEC2Client(): EC2Client {
    if (!this.ec2Client) {
      this.ec2Client = this.createEC2Client();
    }
    return this.ec2Client;
  }

  protected createEC2Client(): EC2Client {
    return createEC2Client();
  }

  async getAllRegions(): Promise<Region[]> {
    const command = new DescribeRegionsCommand({});
    const response = await this.getEC2Client().send(command);

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
