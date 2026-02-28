export interface AccountInfo {
  accountId: string;
  userArn: string;
}

export interface IAccountRepository {
  getAccountInfo(): Promise<AccountInfo>;
}
