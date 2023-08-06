import { CreateChannelDto } from './../dto/create-channel.dto';
import { History } from '../../history/entities/history.entity';
import { Video } from '../../video/entities/video.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reaction } from 'src/reaction/entities/reaction.entity';
import { Subscribe } from 'src/subscribe/entities/subscribe.entity';

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

  @CreateDateColumn({ type: 'datetime' })
  joinDate: Date;

  @OneToMany(() => Reaction, (reaction) => reaction.channel)
  reaction: Reaction[]

  @OneToMany(() => Video, (video) => video.channel)
  videos: Video[]

  @OneToMany(() => History, (history) => history.channel)
  history: History[]

  @ManyToMany(() => Subscribe, subscribe => subscribe.channels)
  @JoinTable({
    name: 'subscribe_channel',
    joinColumns: [{ name: 'subscribed_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'subscriber_id', referencedColumnName: 'id' }],
  })
  subscribers: Subscribe[];
}


