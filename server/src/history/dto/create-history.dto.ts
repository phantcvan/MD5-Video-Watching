import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateHistoryDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  channelId: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  view_date: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  videoId: number;

}
