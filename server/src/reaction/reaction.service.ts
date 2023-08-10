import { VideoService } from 'src/video/video.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { Repository } from 'typeorm';
import { Channel } from 'src/channel/entities/channel.entity';
import { Video } from 'src/video/entities/video.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction) private reactionRepository: Repository<Reaction>,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    private videoService: VideoService,
  ) { }
  async create(createReactionDto: CreateReactionDto) {
    const { videoId, channelId, action } = createReactionDto
    const channel = await this.channelRepository.findOne({ where: { id: channelId } });
    const video = await this.videoRepository.findOne({ where: { id: videoId } });
    if (!channel || !video) {
      throw new Error('Channel or Video not found');
    }

    const newReaction = {
      channel: channel,
      action,
      video: video,
    };
    return this.reactionRepository.save(newReaction);
  }

  async findLikeByVideoId(id: number) {
    const reaction = await this.reactionRepository.find({
      where: { video: { id: id }, action: 1 },
    });
    return reaction.length;
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

  async findOneByVideo(videoId: number, channelId: number) {
    const reaction = await this.reactionRepository.findOne({
      where: {
        channel: { id: channelId },
        video: { id: videoId },
      },
    });
    return reaction;
  }

  async update(updateReactionDto: UpdateReactionDto) {
    const { videoId, channelId, action } = updateReactionDto
    const findReaction = await this.reactionRepository.findOne({
      where: {
        channel: { id: channelId },
        video: { id: videoId },
      },
    });
    // console.log("update", findReaction)
    return `This action updates a #${videoId} reaction`;
  }

  async remove(videoId: number, channelId: number) {
    const findReaction = await this.reactionRepository.findOne({
      where: {
        channel: { id: channelId },
        video: { id: videoId },
      },
    });
    if (findReaction) {
      return this.reactionRepository.remove(findReaction);
    } else {
      throw new NotFoundException('Reaction Not Found')
    }
  }
}
