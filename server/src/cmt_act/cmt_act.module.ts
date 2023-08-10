import { Module } from '@nestjs/common';
import { CmtActService } from './cmt_act.service';
import { CmtActController } from './cmt_act.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmtAct } from './entities/cmt_act.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CmtAct, Channel, Comment])],
  controllers: [CmtActController],
  providers: [CmtActService]
})
export class CmtActModule { }
