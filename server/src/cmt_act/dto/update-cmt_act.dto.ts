import { PartialType } from '@nestjs/swagger';
import { CreateCmtActDto } from './create-cmt_act.dto';

export class UpdateCmtActDto extends PartialType(CreateCmtActDto) {}
