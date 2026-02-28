import { EC2Client, DescribeVolumesCommand } from "@aws-sdk/client-ec2";
import { IVolumeRepository } from "../interfaces/IVolumeRepository.js";
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
}
