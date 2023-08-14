import { Channel } from "src/channel/entities/channel.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Search {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  searchContent: string;

  @ManyToOne(() => Channel, (channel) => channel.search, { onDelete: "CASCADE" })
  channel: Channel;
  
}
