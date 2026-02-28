import { STSClient } from "@aws-sdk/client-sts";
import { EC2Client } from "@aws-sdk/client-ec2";
import { RDSClient } from "@aws-sdk/client-rds";
import { ECSClient } from "@aws-sdk/client-ecs";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";

export interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}

const getEnvCredentials = () => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables."
    );
  }

  const creds: { accessKeyId: string; secretAccessKey: string; sessionToken?: string } = {
    accessKeyId,
    secretAccessKey,
  };

  if (process.env.AWS_SESSION_TOKEN) {
    creds.sessionToken = process.env.AWS_SESSION_TOKEN;
  }

  return creds;
};

const getDefaultRegion = (): string => {
  return process.env.AWS_REGION || "us-east-1";
};

// Create clients with environment variables (backward compatible)
export const createSTSClient = (region?: string): STSClient => {
  return new STSClient({
    region: region || getDefaultRegion(),
    credentials: getEnvCredentials(),
  });
};

export const createEC2Client = (region?: string): EC2Client => {
  return new EC2Client({
    region: region || getDefaultRegion(),
    credentials: getEnvCredentials(),
  });
};

export const createRDSClient = (region?: string): RDSClient => {
  return new RDSClient({
    region: region || getDefaultRegion(),
    credentials: getEnvCredentials(),
  });
};

export const createECSClient = (region?: string): ECSClient => {
  return new ECSClient({
    region: region || getDefaultRegion(),
    credentials: getEnvCredentials(),
  });
};

export const createLambdaClient = (region?: string): LambdaClient => {
  return new LambdaClient({
    region: region || getDefaultRegion(),
    credentials: getEnvCredentials(),
  });
};

export const createCloudWatchClient = (region?: string): CloudWatchClient => {
  return new CloudWatchClient({
    region: region || getDefaultRegion(),
    credentials: getEnvCredentials(),
  });
};

// Create clients with dynamic credentials (for per-request usage)
const buildCredentials = (credentials: AWSCredentials) => {
  const creds: { accessKeyId: string; secretAccessKey: string; sessionToken?: string } = {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
  };
  if (credentials.sessionToken) {
    creds.sessionToken = credentials.sessionToken;
  }
  return creds;
};

export const createSTSClientWithCredentials = (
  region: string,
  credentials: AWSCredentials
): STSClient => {
  return new STSClient({
    region,
    credentials: buildCredentials(credentials),
  });
};

export const createEC2ClientWithCredentials = (
  region: string,
  credentials: AWSCredentials
): EC2Client => {
  return new EC2Client({
    region,
    credentials: buildCredentials(credentials),
  });
};

export const createRDSClientWithCredentials = (
  region: string,
  credentials: AWSCredentials
): RDSClient => {
  return new RDSClient({
    region,
    credentials: buildCredentials(credentials),
  });
};

export const createECSClientWithCredentials = (
  region: string,
  credentials: AWSCredentials
): ECSClient => {
  return new ECSClient({
    region,
    credentials: buildCredentials(credentials),
  });
};

export const createLambdaClientWithCredentials = (
  region: string,
  credentials: AWSCredentials
): LambdaClient => {
  return new LambdaClient({
    region,
    credentials: buildCredentials(credentials),
  });
};

export const createCloudWatchClientWithCredentials = (
  region: string,
  credentials: AWSCredentials
): CloudWatchClient => {
  return new CloudWatchClient({
    region,
    credentials: buildCredentials(credentials),
  });
};
