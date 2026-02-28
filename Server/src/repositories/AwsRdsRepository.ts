import { RDSClient, DescribeDBInstancesCommand } from "@aws-sdk/client-rds";
import {
  IRDSRepository,
  RDSInstance,
} from "../interfaces/IRDSRepository.js";
import { createRDSClient } from "../configs/awsClientFactory.js";

export class AwsRdsRepository implements IRDSRepository {
  async getRunningInstances(region: string): Promise<RDSInstance[]> {
    const rdsClient = createRDSClient(region);

    try {
      const instances: RDSInstance[] = [];
      let marker: string | undefined;

      do {
        const command = new DescribeDBInstancesCommand({
          Marker: marker,
        });

        const response = await rdsClient.send(command);

        if (response.DBInstances) {
          for (const dbInstance of response.DBInstances) {
            if (
              dbInstance.DBInstanceStatus === "available" &&
              dbInstance.DBInstanceIdentifier
            ) {
              instances.push({
                dbInstanceIdentifier: dbInstance.DBInstanceIdentifier,
                dbInstanceStatus: dbInstance.DBInstanceStatus,
                engine: dbInstance.Engine || "unknown",
              });
            }
          }
        }

        marker = response.Marker;
      } while (marker);

      return instances;
    } finally {
      rdsClient.destroy();
    }
  }
}
