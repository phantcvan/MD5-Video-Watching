
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  channel: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  videoId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  cmt_date: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  level: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  cmt_reply: number;
}
