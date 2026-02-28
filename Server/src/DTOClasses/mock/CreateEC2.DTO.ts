import {
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  IsNumber,
  IsIn,
  Min,
  Max,
} from "class-validator";

export class CreateEC2DTO {
  @IsString()
  region!: string;

  @IsString()
  @IsOptional()
  instanceType?: string = "t3.micro";

  @IsString()
  @IsOptional()
  @IsIn(["running", "stopped"])
  state?: "running" | "stopped" = "running";

  @IsObject()
  @IsOptional()
  tags?: Record<string, string> = {};

  @IsBoolean()
  @IsOptional()
  isZombie?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  count?: number = 1;
}
