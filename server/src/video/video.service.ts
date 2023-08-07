import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FilterVideoDto } from './entities/filter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThanOrEqual, FindManyOptions } from 'typeorm';
import { Video } from './entities/video.entity';
import { ChannelService } from 'src/channel/channel.service';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    private channelService: ChannelService,
  ) { }
  create(createVideoDto: CreateVideoDto) {
    return 'This action adds a new video';
  }

  async findAll(start: string): Promise<any> {
    const items_per_page = 9;
    const startIndex = (Number(start) - 1) * items_per_page;
    const endIndex = startIndex + items_per_page;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const videosWithinLastMonthQueryBuilder = this.videoRepository.createQueryBuilder('video');
    videosWithinLastMonthQueryBuilder
      .leftJoinAndSelect('video.channel', 'channel')
      .where('video.upload_date >= :oneMonthAgo', { oneMonthAgo })
      .orderBy('video.views', 'DESC')
      .select([
        'video.id',
        'video.videoUrl',
        'video.title',
        'video.description',
        'video.thumbnail',
        'video.upload_date',
        'video.videoCode',
        'video.views',
        'channel.id',
        'channel.email',
        'channel.channelName',
        'channel.logoUrl',
        'channel.thumbnailM',
        'channel.channelCode',
        'channel.recordHistory',
      ])
      .take(items_per_page);

    const videosAfterLastMonthQueryBuilder = this.videoRepository.createQueryBuilder('video');
    videosAfterLastMonthQueryBuilder
      .leftJoinAndSelect('video.channel', 'channel')
      .where('video.upload_date < :oneMonthAgo', { oneMonthAgo })
      .orderBy('video.upload_date', 'DESC')
      .select([
        'video.id',
        'video.videoUrl',
        'video.title',
        'video.description',
        'video.thumbnail',
        'video.upload_date',
        'video.videoCode',
        'video.views',
        'channel.id',
        'channel.email',
        'channel.channelName',
        'channel.logoUrl',
        'channel.thumbnailM',
        'channel.channelCode',
      ])
      .take(items_per_page);

    const [videosWithinLastMonth, totalWithinLastMonth] = await videosWithinLastMonthQueryBuilder
      .skip(startIndex)
      .getManyAndCount();

    const [videosAfterLastMonth, totalAfterLastMonth] = await videosAfterLastMonthQueryBuilder
      .skip(startIndex)
      .getManyAndCount();

    const res = videosWithinLastMonth.concat(videosAfterLastMonth);
    const total = totalWithinLastMonth + totalAfterLastMonth;

    const totalPages = Math.ceil(total / items_per_page);
    const lastPage = endIndex >= total;

    return {
      videos: res,
      lastPage: lastPage,
    };
  }

  async findAllByTag(start: string, tags: { tag: string }[]): Promise<any> {
    const items_per_page = 9;
    const startIndex = (Number(start) - 1) * items_per_page;
    const endIndex = startIndex + items_per_page;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
    const videosWithinLastMonthQueryBuilder = this.videoRepository.createQueryBuilder('video');
    videosWithinLastMonthQueryBuilder
      .leftJoinAndSelect('video.channel', 'channel')
      .where('video.upload_date >= :oneMonthAgo', { oneMonthAgo })
      .orderBy('RAND()') // Sắp xếp ngẫu nhiên
      .select([
        'video.id',
        'video.videoUrl',
        'video.title',
        'video.description',
        'video.thumbnail',
        'video.upload_date',
        'video.videoCode',
        'video.views',
        'channel.id',
        'channel.email',
        'channel.channelName',
        'channel.logoUrl',
        'channel.thumbnailM',
        'channel.channelCode',
        'channel.recordHistory',
      ])
      .take(items_per_page);
  
    const videosAfterLastMonthQueryBuilder = this.videoRepository.createQueryBuilder('video');
    videosAfterLastMonthQueryBuilder
      .leftJoinAndSelect('video.channel', 'channel')
      .where('video.upload_date < :oneMonthAgo', { oneMonthAgo })
      .orderBy('video.upload_date', 'DESC')
      .select([
        'video.id',
        'video.videoUrl',
        'video.title',
        'video.description',
        'video.thumbnail',
        'video.upload_date',
        'video.videoCode',
        'video.views',
        'channel.id',
        'channel.email',
        'channel.channelName',
        'channel.logoUrl',
        'channel.thumbnailM',
        'channel.channelCode',
      ])
      .take(items_per_page);
  
    const [videosWithinLastMonth, totalWithinLastMonth] = await videosWithinLastMonthQueryBuilder
      .skip(startIndex)
      .getManyAndCount();
  
    const [videosAfterLastMonth, totalAfterLastMonth] = await videosAfterLastMonthQueryBuilder
      .skip(startIndex)
      .getManyAndCount();
  
    const res = videosWithinLastMonth.concat(videosAfterLastMonth);
    const total = totalWithinLastMonth + totalAfterLastMonth;
  
    const totalPages = Math.ceil(total / items_per_page);
    const lastPage = endIndex >= total;
  
    return {
      videos: res,
      lastPage: lastPage,
    };
  }

  // lấy video mới nhất thuộc về channel Id
  async getLatestVideoWithChannelInfo(channelId: number) {
    const query = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.channel', 'channel')
      .where('channel.id = :channelId', { channelId })
      .orderBy('video.upload_date', 'DESC')
      .take(1);

    return query.getOne();
  }




  findOne(videoCode: string) {
    return this.videoRepository.findOne({
      where: { videoCode },
      relations: { channel: true },
    });
  }
// lấy video có videoId=id
  findVideobyId(id: number) {
    return this.videoRepository.findOne({
      where: { id },
      relations: { channel: true },
    });
  }
// lấy video thuộc về channel
  findVideobyChannelId(id: number) {
    return this.videoRepository.find({
      where: { channel: { id: id } },
      relations: { channel: true },
    });
  }


  async findNewVideo() {
    return this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.channel', 'channel')
      .orderBy('video.upload_date', 'DESC')
      .getMany();
  }

  update(videoCode: string, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${videoCode} video`;
  }


  async updateView(videoCode: string, updateVideoDto: UpdateVideoDto) {
    const video = await this.videoRepository.findOne({
      where: { videoCode },
    });
    if (video) {
      video.views = (Number(video.views) || 0) + 1;
      await this.videoRepository.save(video);
      return video;
    } else {
      throw new NotFoundException('Video not found');
    }
  }



  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
