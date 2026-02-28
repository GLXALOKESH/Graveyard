import {
  IsString,
  IsOptional,
  IsIn,
  IsObject,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class AWSCredentialsDTO {
  @IsString()
  accessKeyId!: string;

  @IsString()
  secretAccessKey!: string;

  @IsString()
  @IsOptional()
  sessionToken?: string;
}

export class AccountScanRequestDTO {
  @IsString()
  @IsIn(["mock", "real"])
  accountType!: "mock" | "real";

  @IsObject()
  @ValidateNested()
  @Type(() => AWSCredentialsDTO)
  credentials!: AWSCredentialsDTO;

  @IsString()
  @IsOptional()
  region?: string = "us-east-1";
}
