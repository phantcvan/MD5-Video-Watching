import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FilterVideoDto } from './entities/filter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThanOrEqual, FindManyOptions } from 'typeorm';
import { Video } from './entities/video.entity';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from 'src/channel/entities/channel.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private channelService: ChannelService,
  ) { }
  async create(createVideoDto: CreateVideoDto) {
    const { videoCode, videoUrl, views, title, description, thumbnail, upload_date, channelId } = createVideoDto;
    // console.log(createVideoDto);
    const channel = await this.channelRepository.findOne({ where: { id: channelId } });
    const newVideo = this.videoRepository.create({
      videoCode, videoUrl, views, title, description, thumbnail, upload_date, channel
    })
    if (channel) {
      return this.videoRepository.save(newVideo)
    } else {
      throw new NotFoundException('Channel not found')
    }
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

  async searchVideos(searchQuery: string): Promise<Video[]> {
    const videos = await this.videoRepository
      .createQueryBuilder('video')
      .innerJoinAndSelect('video.channel', 'channel')
      .where(
        `video.title LIKE :searchQuery OR video.description LIKE :searchQuery 
        OR channel.channelName LIKE :searchQuery OR channel.email LIKE :searchQuery`,
        { searchQuery: `%${searchQuery}%` }
      )
      .orderBy('video.upload_date', 'DESC')
      .getMany();

    return videos;
  }


  findOne(videoCode: string) {
    return this.videoRepository.findOne({
      where: { videoCode },
      relations: { channel: true },
    });
  }

  async searchTitle(keyword: string) {
    const results = await this.videoRepository
      .createQueryBuilder('video')
      .select(['video.videoCode', 'video.title']) // Chọn cả videoCode và title
      .where('video.title LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();

    return results.map(video => ({
      videoCode: video.videoCode,
      title: video.title,
    }));
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

  async update(id: number, updateVideoDto: UpdateVideoDto) {
    const video = await this.videoRepository.findOne({ where: { id } })
    if (video) {
      return await this.videoRepository.update(id, updateVideoDto);
    } else {
      return `Video not found`;
    }
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



  async remove(id: number) {
    const findVideo = await this.videoRepository.findOne({ where: { id: id } });
    if (findVideo) {
      return this.videoRepository.remove(findVideo);
    } else {
      throw new NotFoundException('Video not found');
    }
  }
}
