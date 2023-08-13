import { CreateChannelDto } from './../dto/create-channel.dto';
import { History } from '../../history/entities/history.entity';
import { Video } from '../../video/entities/video.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reaction } from 'src/reaction/entities/reaction.entity';
import { Subscribe } from 'src/subscribe/entities/subscribe.entity';
import { CmtAct } from 'src/cmt_act/entities/cmt_act.entity';
import { Search } from 'src/search/entities/search.entity';

@Entity()
export class Channel {
  constructor(createChannelDto: CreateChannelDto) {
    Object.assign(this, createChannelDto)
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "longtext" })
  channelCode: string;

  @Column({ unique: true })
  email: string

  @Column({ type: "longtext" })
  logoUrl: string;

  @Column()
  channelName: string;

  @Column()
  recordHistory: number;

  @Column({ type: "longtext", nullable: true })
  thumbnailM: string

  @Column({ type: "longtext", nullable: true })
  about: string

  @CreateDateColumn({ type: 'datetime' })
  joinDate: Date;

  @OneToMany(() => Reaction, (reaction) => reaction.channel)
  reaction: Reaction[]

  @OneToMany(() => Video, (video) => video.channel)
  videos: Video[]

  @OneToMany(() => History, (history) => history.channel)
  history: History[]

  @OneToMany(() => Subscribe, (subscribe) => subscribe.user)
  subscribe: Subscribe[]

  @OneToMany(() => CmtAct, (cmtAct) => cmtAct.channel)
  cmtAct: CmtAct[]

  @OneToMany(()=>Search, (search)=>search.channel)
  search: Search[]
}


