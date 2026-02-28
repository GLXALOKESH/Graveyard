import { IsString } from "class-validator";

export class CreateS3DTO {
  @IsString()
  region!: string;

  @IsString()
  bucketName!: string;
}
