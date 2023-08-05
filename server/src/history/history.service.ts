import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { DeepPartial, Repository } from 'typeorm';
import { Video } from 'src/video/entities/video.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { ChannelService } from 'src/channel/channel.service';
import { VideoService } from 'src/video/video.service';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History) private historyRepository: Repository<History>,
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private videoService: VideoService,
  ) { }

  async create(createHistoryDto: CreateHistoryDto) {
    const { channelId, videoId, view_date } = createHistoryDto;
    const channel = await this.channelRepository.findOne({ where: { id: +channelId } });
    const video = await this.videoRepository.findOne({ where: { id: +videoId } });
    if (!channel || !video) {
      throw new Error('Channel or Video not found');
    }

    const find = await this.historyRepository.findOne({
      where: {
        channel: { id: +channelId },
        video: { id: +videoId },
        view_date: view_date,
      },
    });
    const newHistory = {
      channel: channel,
      view_date,
      video: video,
    };
    if (!find && channel?.recordHistory === 1) {
      return this.historyRepository.save(newHistory);
    } else if (find && channel?.recordHistory === 1) {
      await this.historyRepository.remove(find);
      return this.historyRepository.save(newHistory);
    } else {
      return "This channel don't turn on watch history.";
    }
  }








  findAll() {
    return `This action returns all history`;
  }

  async findBelongChannel(channelId: number) {
    const histories = await this.historyRepository.find({
      where: { channel: { id: channelId } },
      relations: ['video'],
    });
    // console.log("histories", histories);

    const videoData = [];

    await Promise.all(histories.map(async (item) => {
      const video = await this.videoService.findVideobyId(item.video.id);
      const historyData = {
        id: item.id,
        view_date: item.view_date,
        video
      };
      videoData.push(historyData);
    }));

    return videoData;
  }



  update(id: number, updateHistoryDto: UpdateHistoryDto) {
    return `This action updates a #${id} history`;
  }

  async remove(id: number): Promise<void> {
    await this.historyRepository
      .createQueryBuilder()
      .delete()
      .where("channelId = :id", { id })
      .execute();
  }
}
