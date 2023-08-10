import { type } from 'os';
import { Video } from '../../video/entities/video.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CmtAct } from 'src/cmt_act/entities/cmt_act.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channel: string;

  @Column({ type: "longtext" })
  content: string;

  @Column()
  level: number;

  @Column({ nullable: true })
  cmt_reply: number;

  @CreateDateColumn()
  cmt_date: string;

  @ManyToOne(() => Video, (video) => video.cmts, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'videoId' })
  video: Video

  @OneToMany(() => CmtAct, (cmtAct) => cmtAct.comment)
  cmtAct: CmtAct[]
}