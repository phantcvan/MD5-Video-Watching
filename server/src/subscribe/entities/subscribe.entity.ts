import { Channel } from 'src/channel/entities/channel.entity';
import { CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subscribe {
  @PrimaryGeneratedColumn()
  id: number;

  // @CreateDateColumn({ type: 'datetime' })
  // sub_date: Date;

  @ManyToMany(() => Channel, channel => channel.subscribers)
  @JoinTable({
    name: 'subscribe_channel',
    joinColumns: [{ name: 'subscriber_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'subscribed_id', referencedColumnName: 'id' }],
  })
  channels: Channel[];
}
