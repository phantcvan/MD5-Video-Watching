import { Channel } from "src/channel/entities/channel.entity";
import { Video } from "src/video/entities/video.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: number;

  @ManyToOne(() => Channel, (channel) => channel.reaction, { onDelete: "CASCADE" })
  channel: Channel

  @ManyToOne(() => Video, (video) => video.reaction, { onDelete: "CASCADE" })
  video: Video

}
