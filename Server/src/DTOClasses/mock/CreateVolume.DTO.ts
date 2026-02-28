import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  Min,
  Max,
} from "class-validator";

const validStatuses = ["available", "in-use", "creating", "deleting"];

export class CreateVolumeDTO {
  @IsString()
  region!: string;

  @IsString()
  @IsOptional()
  @IsIn(validStatuses)
  status?: "available" | "in-use" | "creating" | "deleting" = "available";

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(16384)
  size?: number;
}
