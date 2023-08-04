import { type } from 'os';
import { Video } from '../../video/entities/video.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;

  @ManyToOne(() => Video, (video) => video.tags, { onDelete: "CASCADE" })
  video: Video

}
