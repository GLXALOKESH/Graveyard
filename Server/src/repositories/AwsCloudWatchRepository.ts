import {
  CloudWatchClient,
  GetMetricStatisticsCommand,
  Statistic,
} from "@aws-sdk/client-cloudwatch";
import { ICloudWatchRepository } from "../interfaces/ICloudWatchRepository.js";
import { createCloudWatchClient } from "../configs/awsClientFactory.js";

export class AwsCloudWatchRepository implements ICloudWatchRepository {
  protected createCloudWatchClient(region: string): CloudWatchClient {
    return createCloudWatchClient(region);
  }

  private async getAverageMetric(
    region: string,
    namespace: string,
    metricName: string,
    dimensions: { Name: string; Value: string }[],
    days: number = 7
  ): Promise<number> {
    const cloudWatchClient = this.createCloudWatchClient(region);

    try {
      const endTime = new Date();
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - days);

      const command = new GetMetricStatisticsCommand({
        Namespace: namespace,
        MetricName: metricName,
        Dimensions: dimensions,
        StartTime: startTime,
        EndTime: endTime,
        Period: 3600,
        Statistics: [Statistic.Average],
      });

      const response = await cloudWatchClient.send(command);

      if (!response.Datapoints || response.Datapoints.length === 0) {
        return 0;
      }

      const sum = response.Datapoints.reduce((acc, dp) => {
        return acc + (dp.Average || 0);
      }, 0);

      return sum / response.Datapoints.length;
    } finally {
      cloudWatchClient.destroy();
    }
  }

  async getEC2CPUUtilization(
    region: string,
    instanceId: string,
    days: number = 7
  ): Promise<number> {
    return this.getAverageMetric(
      region,
      "AWS/EC2",
      "CPUUtilization",
      [{ Name: "InstanceId", Value: instanceId }],
      days
    );
  }

  async getRDSCPUUtilization(
    region: string,
    dbInstanceIdentifier: string,
    days: number = 7
  ): Promise<number> {
    return this.getAverageMetric(
      region,
      "AWS/RDS",
      "CPUUtilization",
      [{ Name: "DBInstanceIdentifier", Value: dbInstanceIdentifier }],
      days
    );
  }

  async getLambdaInvocations(
    region: string,
    functionName: string,
    days: number = 7
  ): Promise<number> {
    const cloudWatchClient = this.createCloudWatchClient(region);

    try {
      const endTime = new Date();
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - days);

      const command = new GetMetricStatisticsCommand({
        Namespace: "AWS/Lambda",
        MetricName: "Invocations",
        Dimensions: [{ Name: "FunctionName", Value: functionName }],
        StartTime: startTime,
        EndTime: endTime,
        Period: 86400,
        Statistics: [Statistic.Sum],
      });

      const response = await cloudWatchClient.send(command);

      if (!response.Datapoints || response.Datapoints.length === 0) {
        return 0;
      }

      const total = response.Datapoints.reduce((acc, dp) => {
        return acc + (dp.Sum || 0);
      }, 0);

      return total / days;
    } finally {
      cloudWatchClient.destroy();
    }
  }

  async getLambdaDuration(
    region: string,
    functionName: string,
    days: number = 7
  ): Promise<number> {
    return this.getAverageMetric(
      region,
      "AWS/Lambda",
      "Duration",
      [{ Name: "FunctionName", Value: functionName }],
      days
    );
  }

  async getEC2NetworkTraffic(
    region: string,
    instanceId: string,
    days: number = 7
  ): Promise<number> {
    const cloudWatchClient = this.createCloudWatchClient(region);

    try {
      const endTime = new Date();
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - days);

      const [inResponse, outResponse] = await Promise.all([
        cloudWatchClient.send(
          new GetMetricStatisticsCommand({
            Namespace: "AWS/EC2",
            MetricName: "NetworkIn",
            Dimensions: [{ Name: "InstanceId", Value: instanceId }],
            StartTime: startTime,
            EndTime: endTime,
            Period: 3600,
            Statistics: [Statistic.Average],
          })
        ),
        cloudWatchClient.send(
          new GetMetricStatisticsCommand({
            Namespace: "AWS/EC2",
            MetricName: "NetworkOut",
            Dimensions: [{ Name: "InstanceId", Value: instanceId }],
            StartTime: startTime,
            EndTime: endTime,
            Period: 3600,
            Statistics: [Statistic.Average],
          })
        ),
      ]);

      const inSum =
        inResponse.Datapoints?.reduce((acc, dp) => acc + (dp.Average || 0), 0) ||
        0;
      const outSum =
        outResponse.Datapoints?.reduce((acc, dp) => acc + (dp.Average || 0), 0) ||
        0;

      const dataPoints = Math.max(
        inResponse.Datapoints?.length || 0,
        outResponse.Datapoints?.length || 0
      );

      if (dataPoints === 0) return 0;

      return (inSum + outSum) / dataPoints;
    } finally {
      cloudWatchClient.destroy();
    }
  }

  async getRDSConnections(
    region: string,
    dbInstanceIdentifier: string,
    days: number = 7
  ): Promise<number> {
    return this.getAverageMetric(
      region,
      "AWS/RDS",
      "DatabaseConnections",
      [{ Name: "DBInstanceIdentifier", Value: dbInstanceIdentifier }],
      days
    );
  }
}
