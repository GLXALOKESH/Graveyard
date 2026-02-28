import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import {
  IAccountRepository,
  AccountInfo,
} from "../interfaces/IAccountRepository.js";
import { createSTSClient } from "../configs/awsClientFactory.js";

export class AwsAccountRepository implements IAccountRepository {
  private stsClient: STSClient | null = null;

  protected getSTSClient(): STSClient {
    if (!this.stsClient) {
      this.stsClient = this.createSTSClient();
    }
    return this.stsClient;
  }

  protected createSTSClient(): STSClient {
    return createSTSClient();
  }

  async getAccountInfo(): Promise<AccountInfo> {
    const command = new GetCallerIdentityCommand({});
    const response = await this.getSTSClient().send(command);

    return {
      accountId: response.Account || "unknown",
      userArn: response.Arn || "unknown",
    };
  }
}
