import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import {
  IAccountRepository,
  AccountInfo,
} from "../interfaces/IAccountRepository.js";
import { createSTSClient } from "../configs/awsClientFactory.js";

export class AwsAccountRepository implements IAccountRepository {
  private stsClient: STSClient;

  constructor() {
    this.stsClient = this.createSTSClient();
  }

  protected createSTSClient(): STSClient {
    return createSTSClient();
  }

  async getAccountInfo(): Promise<AccountInfo> {
    const command = new GetCallerIdentityCommand({});
    const response = await this.stsClient.send(command);

    return {
      accountId: response.Account || "unknown",
      userArn: response.Arn || "unknown",
    };
  }
}
