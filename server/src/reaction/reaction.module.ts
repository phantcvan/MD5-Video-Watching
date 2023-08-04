import { VideoModule } from 'src/video/video.module';
import { Video } from 'src/video/entities/video.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Video, Reaction]), VideoModule],
  controllers: [ReactionController],
  providers: [ReactionService],
  exports: [ReactionService],
})
export class ReactionModule { }
