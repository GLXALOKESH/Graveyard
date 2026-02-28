import {
  EC2Client,
  DescribeInstancesCommand,
  InstanceStateName,
} from "@aws-sdk/client-ec2";
import {
  IInstanceRepository,
  EC2Instance,
} from "../interfaces/IInstanceRepository.js";
import { createEC2Client } from "../configs/awsClientFactory.js";

export class AwsInstanceRepository implements IInstanceRepository {
  protected createEC2Client(region: string): EC2Client {
    return createEC2Client(region);
  }

  async countRunningInstances(region: string): Promise<number> {
    const ec2Client = this.createEC2Client(region);

    try {
      let runningCount = 0;
      let nextToken: string | undefined;

      do {
        const command = new DescribeInstancesCommand({
          NextToken: nextToken,
          Filters: [
            {
              Name: "instance-state-name",
              Values: [InstanceStateName.running],
            },
          ],
        });

        const response = await ec2Client.send(command);

        if (response.Reservations) {
          for (const reservation of response.Reservations) {
            if (reservation.Instances) {
              runningCount += reservation.Instances.length;
            }
          }
        }

        nextToken = response.NextToken;
      } while (nextToken);

      return runningCount;
    } finally {
      ec2Client.destroy();
    }
  }

  async getRunningInstances(region: string): Promise<EC2Instance[]> {
    const ec2Client = this.createEC2Client(region);

    try {
      const instances: EC2Instance[] = [];
      let nextToken: string | undefined;

      do {
        const command = new DescribeInstancesCommand({
          NextToken: nextToken,
          Filters: [
            {
              Name: "instance-state-name",
              Values: [InstanceStateName.running],
            },
          ],
        });

        const response = await ec2Client.send(command);

        if (response.Reservations) {
          for (const reservation of response.Reservations) {
            if (reservation.Instances) {
              for (const instance of reservation.Instances) {
                if (instance.InstanceId) {
                  const tags: Record<string, string> = {};
                  if (instance.Tags) {
                    for (const tag of instance.Tags) {
                      if (tag.Key && tag.Value) {
                        tags[tag.Key] = tag.Value;
                      }
                    }
                  }

                  instances.push({
                    instanceId: instance.InstanceId,
                    instanceType: instance.InstanceType || "unknown",
                    tags,
                  });
                }
              }
            }
          }
        }

        nextToken = response.NextToken;
      } while (nextToken);

      return instances;
    } finally {
      ec2Client.destroy();
    }
  }
}
