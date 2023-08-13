import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag } from './entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from '../video/entities/video.entity';
import { Channel } from '../channel/entities/channel.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Video, Channel]), JwtModule],
  controllers: [TagController],
  providers: [TagService]
})
export class TagModule { }
