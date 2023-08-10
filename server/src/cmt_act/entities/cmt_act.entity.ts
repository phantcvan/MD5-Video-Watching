import { Channel } from "src/channel/entities/channel.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CmtAct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: number;

  @ManyToOne(() => Comment, (comment) => comment.cmtAct, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'commentId' })
  comment: Comment

  @ManyToOne(() => Channel, (channel) => channel.cmtAct, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'channelId' })
  channel: Channel
}
