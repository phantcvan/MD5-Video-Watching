import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(()=>String)
  tag:string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(()=>String)
  videoCode:string;
}
