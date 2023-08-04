
import { Channel } from '../../channel/entities/channel.entity';
import { Video } from '../../video/entities/video.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  view_date: string;

  @ManyToOne(() => Video, (video) => video.history, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'videoId' })
  video: Video

  @ManyToOne(() => Channel, (channel) => channel.history, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'channelId' })
  channel: Channel
}