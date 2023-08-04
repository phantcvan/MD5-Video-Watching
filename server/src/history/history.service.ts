import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { Repository } from 'typeorm';
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

  create(createHistoryDto: CreateHistoryDto) {
    return 'This action adds a new history';
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
