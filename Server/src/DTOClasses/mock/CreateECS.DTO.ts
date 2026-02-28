import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
  ArrayMinSize,
} from "class-validator";
import { Type } from "class-transformer";

class ECSServiceDTO {
  @IsString()
  serviceName!: string;

  @IsNumber()
  runningCount!: number;

  @IsNumber()
  desiredCount!: number;

  @IsString()
  @IsOptional()
  status?: string = "ACTIVE";
}

export class CreateECSDTO {
  @IsString()
  region!: string;

  @IsString()
  clusterName!: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ECSServiceDTO)
  services?: ECSServiceDTO[] = [];
}
