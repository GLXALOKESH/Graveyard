export class MockRoutes {
  static readonly BASE_PATH: string = "/mock";

  // EC2 endpoints
  static readonly EC2: string = "/ec2";
  static readonly EC2_LIST: string = "/ec2/:region";

  // ECS endpoints
  static readonly ECS: string = "/ecs";
  static readonly ECS_LIST: string = "/ecs/:region";

  // Lambda endpoints
  static readonly LAMBDA: string = "/lambda";
  static readonly LAMBDA_LIST: string = "/lambda/:region";

  // RDS endpoints
  static readonly RDS: string = "/rds";
  static readonly RDS_LIST: string = "/rds/:region";

  // S3 endpoints
  static readonly S3: string = "/s3";
  static readonly S3_LIST: string = "/s3/:region";

  // Volume endpoints
  static readonly VOLUME: string = "/volume";
  static readonly VOLUME_LIST: string = "/volume/:region";

  // State management endpoints
  static readonly RESET: string = "/reset";
  static readonly RESET_REGION: string = "/reset/:region";
}
