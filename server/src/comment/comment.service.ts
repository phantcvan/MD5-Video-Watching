import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Video } from '../video/entities/video.entity';
import { Channel } from 'src/channel/entities/channel.entity';

@Injectable()
export class CommentService {
  constructor(@InjectRepository(Comment) private cmtRepo: Repository<Comment>,
    @InjectRepository(Video) private videoRepo: Repository<Video>,
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
  ) { }
  async create(createCommentDto: CreateCommentDto) {
    const { channel, videoId, content, cmt_date, level, cmt_reply } = createCommentDto;
    // console.log("videoId", videoId);
    const findChannel = await this.channelRepo.findOne({
      where: { email: channel }
    })
    const findVideo = await this.videoRepo.findOne({
      where: { id: videoId }
    })
    if (findChannel && findVideo) {
      const newCmt = {
        channel,
        content,
        cmt_date,
        video: findVideo,
        level,
        cmt_reply
      }
      // console.log("newCmt", newCmt);
      return this.cmtRepo.save(newCmt)
    } else {
      throw new Error('Channel or Video not found');
    }

  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async findAllCmtBelongVideo(videoId: number): Promise<Comment[]> {
    return this.cmtRepo.find({ where: { video: { id: videoId } }, order: { cmt_date: 'ASC' } });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
