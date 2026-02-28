import { EC2Client, DescribeVolumesCommand } from "@aws-sdk/client-ec2";
import { IVolumeRepository, Volume } from "../interfaces/IVolumeRepository.js";
import { createEC2Client } from "../configs/awsClientFactory.js";

export class AwsVolumeRepository implements IVolumeRepository {
  async countUnattachedVolumes(region: string): Promise<number> {
    const ec2Client = createEC2Client(region);

    try {
      let unattachedCount = 0;
      let nextToken: string | undefined;

      do {
        const command = new DescribeVolumesCommand({
          NextToken: nextToken,
          Filters: [
            {
              Name: "status",
              Values: ["available"],
            },
          ],
        });

        const response = await ec2Client.send(command);

        if (response.Volumes) {
          unattachedCount += response.Volumes.length;
        }

        nextToken = response.NextToken;
      } while (nextToken);

      return unattachedCount;
    } finally {
      ec2Client.destroy();
    }
  }

  async getVolumes(region: string): Promise<Volume[]> {
    const ec2Client = createEC2Client(region);

    try {
      const volumes: Volume[] = [];
      let nextToken: string | undefined;

      do {
        const command = new DescribeVolumesCommand({
          NextToken: nextToken,
        });

        const response = await ec2Client.send(command);

        if (response.Volumes) {
          for (const vol of response.Volumes) {
            volumes.push({
              volumeId: vol.VolumeId || "unknown",
              status: (vol.State as "available" | "in-use") || "available",
              size: vol.Size || 0,
            });
          }
        }

        nextToken = response.NextToken;
      } while (nextToken);

      return volumes;
    } finally {
      ec2Client.destroy();
    }
  }
}
