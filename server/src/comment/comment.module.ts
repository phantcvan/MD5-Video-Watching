import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Video } from '../video/entities/video.entity';
import { Channel } from '../channel/entities/channel.entity';
import { ChannelModule } from 'src/channel/channel.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Video, Channel]),ChannelModule],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
