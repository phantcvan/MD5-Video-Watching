import { type } from 'os';
import { Video } from '../../video/entities/video.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channel: string;

  @Column()
  content: string;

  @Column()
  level: number;

  @Column({ nullable: true })
  cmt_reply: number;

  @CreateDateColumn()
  cmt_date: string;

  @ManyToOne(() => Video, (video) => video.cmts, { onDelete: "CASCADE" })
  video: Video
}