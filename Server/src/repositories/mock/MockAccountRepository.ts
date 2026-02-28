import { IAccountRepository, AccountInfo } from "../../interfaces/IAccountRepository.js";

/**
 * MockAccountRepository - Simulates STS getCallerIdentity
 * Implements IAccountRepository interface
 */
export class MockAccountRepository implements IAccountRepository {
  private mockAccountId: string;
  private mockUserArn: string;

  constructor() {
    this.mockAccountId = process.env.MOCK_ACCOUNT_ID || "123456789012";
    this.mockUserArn = process.env.MOCK_USER_ARN || `arn:aws:iam::${this.mockAccountId}:user/mock-user`;
  }

  /**
   * IAccountRepository implementation
   * Returns mock account info
   */
  async getAccountInfo(): Promise<AccountInfo> {
    return {
      accountId: this.mockAccountId,
      userArn: this.mockUserArn,
    };
  }

  /**
   * Set mock account ID
   */
  setAccountId(accountId: string): void {
    this.mockAccountId = accountId;
  }

  /**
   * Set mock user ARN
   */
  setUserArn(userArn: string): void {
    this.mockUserArn = userArn;
  }
}
