import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';
import { Subscribe } from './entities/subscribe.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { Channel } from 'src/channel/entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscribe, Channel]), ChannelModule],
  controllers: [SubscribeController],
  providers: [SubscribeService],
  exports: [SubscribeService],

})
export class SubscribeModule { }
