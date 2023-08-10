import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateReactionDto {
  
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  action: number;
  
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  channelId: number;
  
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  videoId: number;
}
