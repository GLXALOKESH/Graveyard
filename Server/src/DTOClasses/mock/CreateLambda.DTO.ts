import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsIn,
  Min,
  Max,
} from "class-validator";

const validRuntimes = [
  "nodejs18.x",
  "nodejs16.x",
  "python3.11",
  "python3.10",
  "java17",
  "dotnet6",
  "go1.x",
  "ruby3.2",
];

export class CreateLambdaDTO {
  @IsString()
  region!: string;

  @IsString()
  functionName!: string;

  @IsString()
  @IsOptional()
  @IsIn(validRuntimes)
  runtime?: string = "nodejs18.x";

  @IsNumber()
  @IsOptional()
  @Min(128)
  @Max(10240)
  memorySize?: number = 128;

  @IsBoolean()
  @IsOptional()
  isZombie?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  count?: number = 1;
}
