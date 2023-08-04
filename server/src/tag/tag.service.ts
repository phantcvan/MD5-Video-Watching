import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { OrderByCondition, Repository } from 'typeorm';
import { Video } from '../video/entities/video.entity';
import { Channel } from '../channel/entities/channel.entity';

interface UniqueTag {
  tag: string;
}

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>
  ) { }

  create(createTagDto: CreateTagDto) {
    return 'This action adds a new tag';
  }

  async findAll(): Promise<{tag: string;}[]> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 2);

    const tagsQueryBuilder = this.tagRepository.createQueryBuilder('tag');
    tagsQueryBuilder
      .leftJoinAndSelect('tag.video', 'video')
      .where('video.upload_date >= :oneMonthAgo', { oneMonthAgo })
      .orderBy('video.views', 'DESC')
      .select([
        'tag.tag',
      ])
    const [tags] = await tagsQueryBuilder
      .getManyAndCount();
    const uniqueTagsSet = new Set(tags.map((tag) => tag.tag));

    // Chuyển đổi Set thành mảng đối tượng với cấu trúc { tag: 'value' }
    const uniqueTagsArray = Array.from(uniqueTagsSet).map((tag) => ({ tag }));

    return uniqueTagsArray;
  }

  async findAllVideoWithTagInfo(tag: string): Promise<Video[]> {
    const orderBy = {
      'video.upload_date': 'DESC', // Sort by upload_date in descending order
    };
    const videos = await this.videoRepository
      .createQueryBuilder('video')
      .innerJoinAndSelect('video.tags', 'tag', 'tag.tag = :tag', { tag }) // Lấy video có tag cụ thể
      .leftJoinAndSelect('video.channel', 'channel') // Lấy thông tin channel liên quan
      .select([
        'video.id',
        'video.videoCode',
        'video.videoUrl',
        'video.views',
        'video.title',
        'video.thumbnail',
        'video.description',
        'video.upload_date',
        'channel.id',
        'channel.channelName',
        'channel.logoUrl',
      ])
      .orderBy('video.upload_date', 'DESC')
      .getMany();

    return videos;
  }

  async findAllTagBelongVideo(videoId: number): Promise<Tag[]> {
    return this.tagRepository
      .createQueryBuilder('tag')
      .select('DISTINCT(tag.tag)', 'tag')
      .where('tag.videoId = :videoId', { videoId }) // Sử dụng dấu hai chấm và tên tham số
      .getRawMany();
  }


  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
