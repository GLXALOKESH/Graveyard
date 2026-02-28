import { STSClient } from "@aws-sdk/client-sts";
import { EC2Client } from "@aws-sdk/client-ec2";
import { RDSClient } from "@aws-sdk/client-rds";
import { ECSClient } from "@aws-sdk/client-ecs";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";

const getCredentials = () => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables."
    );
  }

  return {
    accessKeyId,
    secretAccessKey,
  };
};

const getDefaultRegion = (): string => {
  return process.env.AWS_REGION || "us-east-1";
};

export const createSTSClient = (region?: string): STSClient => {
  return new STSClient({
    region: region || getDefaultRegion(),
    credentials: getCredentials(),
  });
};

export const createEC2Client = (region?: string): EC2Client => {
  return new EC2Client({
    region: region || getDefaultRegion(),
    credentials: getCredentials(),
  });
};

export const createRDSClient = (region?: string): RDSClient => {
  return new RDSClient({
    region: region || getDefaultRegion(),
    credentials: getCredentials(),
  });
};

export const createECSClient = (region?: string): ECSClient => {
  return new ECSClient({
    region: region || getDefaultRegion(),
    credentials: getCredentials(),
  });
};

export const createLambdaClient = (region?: string): LambdaClient => {
  return new LambdaClient({
    region: region || getDefaultRegion(),
    credentials: getCredentials(),
  });
};

export const createCloudWatchClient = (region?: string): CloudWatchClient => {
  return new CloudWatchClient({
    region: region || getDefaultRegion(),
    credentials: getCredentials(),
  });
};
