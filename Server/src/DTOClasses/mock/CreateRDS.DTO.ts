import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsIn,
  Min,
  Max,
} from "class-validator";

const validEngines = [
  "postgres",
  "mysql",
  "mariadb",
  "sqlserver-ex",
  "oracle-se2",
];

const validStatuses = ["available", "creating", "deleting"];

export class CreateRDSDTO {
  @IsString()
  region!: string;

  @IsString()
  dbInstanceIdentifier!: string;

  @IsString()
  @IsOptional()
  @IsIn(validEngines)
  engine?: string = "postgres";

  @IsString()
  @IsOptional()
  @IsIn(validStatuses)
  status?: "available" | "creating" | "deleting" = "available";

  @IsBoolean()
  @IsOptional()
  isZombie?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  count?: number = 1;
}
