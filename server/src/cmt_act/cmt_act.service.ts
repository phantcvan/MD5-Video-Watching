import { Injectable } from '@nestjs/common';
import { CreateCmtActDto } from './dto/create-cmt_act.dto';
import { UpdateCmtActDto } from './dto/update-cmt_act.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmtAct } from './entities/cmt_act.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Injectable()
export class CmtActService {
  constructor(@InjectRepository(CmtAct) private CmtActRepo: Repository<CmtAct>,
    @InjectRepository(Comment) private CmtRepo: Repository<Comment>
  ) { }
  create(createCmtActDto: CreateCmtActDto) {
    return 'This action adds a new cmtAct';
  }

  findAll() {
    return `This action returns all cmtAct`;
  }

  async findReactionOfCmt(id: number) {
    const cmtReactions = await this.CmtActRepo.find({
      where: { comment: { id: id } },
      relations: ['channel']
    })
    const result = cmtReactions.map((cmtReaction) => {
      return {
        id: cmtReaction.id,
        channelId: cmtReaction.channel.id,
        action: cmtReaction.action
      };
    });
    return result;
  }

  update(id: number, updateCmtActDto: UpdateCmtActDto) {

    
    return `This action updates a #${id} cmtAct`;
  }

  remove(id: number) {
    return `This action removes a #${id} cmtAct`;
  }
}
