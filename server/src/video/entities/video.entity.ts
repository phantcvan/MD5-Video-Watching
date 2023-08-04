import { type } from 'os';
import { Channel } from '../../channel/entities/channel.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';
import { History } from '../../history/entities/history.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "longtext" })
  videoCode: string;

  @Column({ type: "longtext" })
  videoUrl: string

  @Column({ type: "bigint" })
  views: number;

  @Column({ type: "longtext" })
  title: string;

  @Column({ type: "longtext" })
  description: string

  @Column({ type: "longtext" })
  thumbnail: string

  @CreateDateColumn({ type: 'datetime' })
  upload_date: Date;

  @ManyToOne(() => Channel, (channel) => channel.videos, { onDelete: "CASCADE" })
  channel: Channel

  @OneToMany(() => Tag, (tag) => tag.video)
  tags: Tag[]

  @OneToMany(() => History, (history) => history.video)
  history: History[]

  @OneToMany(() => Comment, (cmt) => cmt.video)
  cmts: Comment[]
}


