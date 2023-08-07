import { Channel } from 'src/channel/entities/channel.entity';
import { Injectable } from '@nestjs/common';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { UpdateSubscribeDto } from './dto/update-subscribe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscribe } from './entities/subscribe.entity';
import { ChannelService } from 'src/channel/channel.service';

@Injectable()
export class SubscribeService {
  constructor(
    @InjectRepository(Subscribe) private subsRepo: Repository<Subscribe>,
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,

  ) { }


  create(createSubscribeDto: CreateSubscribeDto) {
    return 'This action adds a new subscribe';
  }

  findAll() {
    return `This action returns all subscribe`;
  }
  // Lấy danh sách người đăng ký của một kênh:
  async findListSubscriber(channelId: number) {
    const query = `
      SELECT channel.*
      FROM channel
      INNER JOIN subscribe_channel AS subscribe
      ON channel.id = subscribe.subscriber_id
      WHERE subscribe.subscribed_id = ?
    `;

    const channels = await this.channelRepo.query(query, [channelId]);
    return channels;
  }


  // Lấy danh sách kênh đăng ký của một người:
  async findListSubscribed(channelId: number) {
    const query = `
      SELECT channel.*
      FROM channel
      INNER JOIN subscribe_channel AS subscribe
      ON channel.id = subscribe.subscribed_id
      WHERE subscribe.subscriber_id = ?
    `;

    const channels = await this.channelRepo.query(query, [channelId]);
    return channels;
  }

  update(id: number, updateSubscribeDto: UpdateSubscribeDto) {
    return `This action updates a #${id} subscribe`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscribe`;
  }
}
