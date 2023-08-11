import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCmtActDto } from './dto/create-cmt_act.dto';
import { UpdateCmtActDto } from './dto/update-cmt_act.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmtAct } from './entities/cmt_act.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Channel } from 'src/channel/entities/channel.entity';

@Injectable()
export class CmtActService {
  constructor(@InjectRepository(CmtAct) private CmtActRepo: Repository<CmtAct>,
    @InjectRepository(Comment) private CmtRepo: Repository<Comment>,
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    @InjectRepository(Comment) private cmtRepo: Repository<Comment>
  ) { }
  async create(createCmtActDto: CreateCmtActDto) {
    const { commentId, channelId, action } = createCmtActDto;
    const comment = await this.cmtRepo.findOne({ where: { id: commentId } });
    const channel = await this.channelRepo.findOne({ where: { id: channelId } });
    if (comment && channel) {
      const newCmtAct = {
        comment: comment,
        channel: channel,
        action
      }
      return this.CmtActRepo.save(newCmtAct);
    }
    throw new NotFoundException('Comment or Channel not found')
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

  async update(updateCmtActDto: UpdateCmtActDto) {
    const { commentId, channelId, action } = updateCmtActDto;
    const channel = await this.channelRepo.findOne({
      where: { id: channelId }
    })
    const cmt = await this.cmtRepo.findOne({
      where: { id: commentId }
    })
    const findReaction = await this.CmtActRepo.findOne({
      where: {
        channel: { id: channelId },
        comment: { id: commentId },
      },
    });
    if (findReaction && cmt && channel) {
      const newReact = {
        action,
        comment: cmt,
        channel
      }
      return await this.CmtActRepo.update(findReaction.id, newReact)
    } else {
      throw new NotFoundException('Reaction Not Found')
    }
  }

  async remove(cmtId: number, channelId: number) {
    const findCmtAct = await this.CmtActRepo.findOne({ where: { comment: { id: cmtId }, channel: { id: channelId } } });
    if (findCmtAct) {
      return this.CmtActRepo.remove(findCmtAct)
    } else {
      return 'Comment Reaction not found'
    }
  }
}
