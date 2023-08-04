import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Video } from '../video/entities/video.entity';

@Injectable()
export class CommentService {
  constructor(@InjectRepository(Comment) private CmtRepo: Repository<Comment>,
    @InjectRepository(Video) private VideoRepo: Repository<Video>,
  ) { }
  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

async findAllCmtBelongVideo(videoId: number): Promise<Comment[]> {
  return this.CmtRepo.find({ where: { video: { id: videoId } } });
}

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
