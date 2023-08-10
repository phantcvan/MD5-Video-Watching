import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
export class CreateSubscribeDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  userId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  subscribed_id: number;
}
