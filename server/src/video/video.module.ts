import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { Video } from './entities/video.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { Channel } from 'src/channel/entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Channel]), ChannelModule],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule { }
