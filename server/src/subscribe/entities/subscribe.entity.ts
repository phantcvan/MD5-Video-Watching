import { Channel } from 'src/channel/entities/channel.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subscribe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subscribed_id: number;

  @ManyToOne(() => Channel, (channel) => channel.subscribe, { onDelete: "CASCADE" })
  user: Channel
}
