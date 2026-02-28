import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";

class ECSClusterConfigDTO {
  @IsString()
  clusterName!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ECSServiceConfigDTO)
  services!: ECSServiceConfigDTO[];
}

class ECSServiceConfigDTO {
  @IsString()
  serviceName!: string;

  @IsNumber()
  runningCount!: number;

  @IsNumber()
  desiredCount!: number;
}

export class BulkCreateDTO {
  @IsString()
  region!: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  ec2Count?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  lambdaCount?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  rdsCount?: number = 0;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ECSClusterConfigDTO)
  ecsClusters?: ECSClusterConfigDTO[] = [];

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  s3Count?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  volumeCount?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  zombieRatio?: number = 0.3;
}
