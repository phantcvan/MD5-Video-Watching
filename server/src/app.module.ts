import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelModule } from './channel/channel.module';
import { Channel } from './channel/entities/channel.entity';
import { VideoModule } from './video/video.module';
import { Video } from './video/entities/video.entity';
import { TagModule } from './tag/tag.module';
import { Tag } from './tag/entities/tag.entity';
import { AppController } from './app.controller';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/entities/comment.entity';
import { HistoryModule } from './history/history.module';
import { History } from './history/entities/history.entity';
import { AuthModule } from './auth/auth.module';
import { ReactionModule } from './reaction/reaction.module';
import { Reaction } from './reaction/entities/reaction.entity';
import { SubscribeModule } from './subscribe/subscribe.module';
import { Subscribe } from './subscribe/entities/subscribe.entity';
import { CmtActModule } from './cmt_act/cmt_act.module';
import { CmtAct } from './cmt_act/entities/cmt_act.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: configService.get<boolean>('DATABASE_SYNC'),
        logging: configService.get<boolean>('DATABASE_LOGGING'),
        // entities: [__dirname + '/**/*.entity{.ts,.js}'],
        entities: [Channel, Video, Tag, Comment, History, Reaction, Subscribe, CmtAct],
      }),
    }),
    ChannelModule,
    VideoModule,
    TagModule,
    CommentModule,
    HistoryModule,
    AuthModule,
    ReactionModule,
    SubscribeModule,
    CmtActModule,
  ],
})
export class AppModule { }