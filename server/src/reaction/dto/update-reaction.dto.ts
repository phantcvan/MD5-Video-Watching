import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReactionDto } from './create-reaction.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReactionDto {

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
