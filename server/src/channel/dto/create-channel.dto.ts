import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateChannelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  channelName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  joinDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  logoUrl: string;

  @ApiProperty()
  @IsOptional()
  thumbnailM: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  channelCode: string;

  @ApiProperty()
  @IsOptional()
  about: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  recordHistory: number;
}


