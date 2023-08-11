import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateVideoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  videoCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  videoUrl: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  views: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  thumbnail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  upload_date: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  channelId: number;
}
