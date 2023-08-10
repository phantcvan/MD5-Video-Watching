import { Injectable } from '@nestjs/common';
import { CreateCmtActDto } from './dto/create-cmt_act.dto';
import { UpdateCmtActDto } from './dto/update-cmt_act.dto';

@Injectable()
export class CmtActService {
  create(createCmtActDto: CreateCmtActDto) {
    return 'This action adds a new cmtAct';
  }

  findAll() {
    return `This action returns all cmtAct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cmtAct`;
  }

  update(id: number, updateCmtActDto: UpdateCmtActDto) {
    return `This action updates a #${id} cmtAct`;
  }

  remove(id: number) {
    return `This action removes a #${id} cmtAct`;
  }
}
