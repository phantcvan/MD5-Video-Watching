import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSearchDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  searchContent: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  channelId: number;
}
