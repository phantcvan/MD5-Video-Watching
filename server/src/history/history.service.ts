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
    // console.log("createHistoryDto", createHistoryDto);
    const channel = await this.channelRepository.findOne({ where: { id: channelId } });
    const video = await this.videoRepository.findOne({ where: { id: videoId } });
    if (!channel || !video) {
      throw new Error('Channel or Video not found');
    }

    const existingHistory = await this.historyRepository.findOne({
      where: {
        channel: { id: channelId },
        video: { id: videoId },
      },
      order: { view_date: 'DESC' },
    });

    const newHistory = {
      channel: channel,
      view_date,
      video: video,
    };
    if (channel?.recordHistory === 1) {
      if (!existingHistory) {
        console.log("Thêm mới");
        return this.historyRepository.save(newHistory);
      } else if (existingHistory) {
        const existingDate = new Date(existingHistory.view_date);
        const newDate = new Date(view_date);
        function isSameDate(date1: Date, date2: Date): boolean {
          return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
          );
        }
        if (isSameDate(existingDate, newDate)) {
          await this.historyRepository.remove(existingHistory); // Xoá dữ liệu cũ
          console.log("Update");
          return this.historyRepository.save(newHistory);
        } else if (!isSameDate(existingDate, newDate)) {
          return this.historyRepository.save(newHistory);
        }
      }
    } else {
      console.log("Pause History");
      return "This channel doesn't have watch history turned on.";
    }
  }


  findAll() {
    return `This action returns all history`;
  }

  async findBelongChannel(channelId: number) {
    // console.log("channelId", channelId);
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
    // const uniqueHistory = [];
    // videoData.forEach((video) => {
    //   if (!uniqueHistory.some((uniqueVideo) => uniqueVideo.video.id === video.video.id)) {
    //     uniqueHistory.push(video);
    //   }
    // });


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
