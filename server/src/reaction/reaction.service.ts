import { VideoService } from 'src/video/video.service';
import { Injectable } from '@nestjs/common';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReactionService {
  constructor(@InjectRepository(Reaction) private reactionRepository: Repository<Reaction>,
    private videoService: VideoService,
  ) { }
  create(createReactionDto: CreateReactionDto) {
    return 'This action adds a new reaction';
  }

  findAll() {
    return `This action returns all reaction`;
  }

  async findAllByChannelId(id: number) {
    const reaction = await this.reactionRepository.find({
      where: { channel: { id: id }, action: 1 },
      relations: { video: true },
    });
    const videoData = [];

    await Promise.all(reaction.reverse().map(async (item) => {
      const video = await this.videoService.findVideobyId(item.video.id);
      videoData.push(video);
    }));

    return videoData;
  }

  findOne(id: number) {
    return `This action returns a #${id} reaction`;
  }

  update(id: number, updateReactionDto: UpdateReactionDto) {
    return `This action updates a #${id} reaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} reaction`;
  }
}
