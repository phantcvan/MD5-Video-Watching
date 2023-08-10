import { Channel } from 'src/channel/entities/channel.entity';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { UpdateSubscribeDto } from './dto/update-subscribe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Subscribe } from './entities/subscribe.entity';
import { ChannelService } from 'src/channel/channel.service';

@Injectable()
export class SubscribeService {
  constructor(
    @InjectRepository(Subscribe) private subsRepo: Repository<Subscribe>,
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,

  ) { }


  async create(createSubscribeDto: CreateSubscribeDto) {
    try {
      // console.log("createSubscribeDto", createSubscribeDto);
      const { userId, subscribed_id } = createSubscribeDto
      const user = await this.channelRepo.findOne({ where: { id: Number(userId) } });
      const channel = await this.channelRepo.findOne({ where: { id: subscribed_id } });
      const newSubscribe = this.subsRepo.create({
        user,
        subscribed_id,
      });
      if (user && channel) {
        // console.log("newSubscribe", newSubscribe);
        return this.subsRepo.save(newSubscribe)
      } else {
        throw new NotFoundException("User or channel not found");
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException("User or channel not found");
      } else {
        throw new InternalServerErrorException("Failed to create subscription");
      }
    }
  }

  findAll() {
    return `This action returns all subscribe`;
  }
  // Lấy danh sách người đăng ký của một kênh:
  async findListSubscriber(channelId: number) {
    const channels = await this.subsRepo.find({
      where: { subscribed_id: channelId },
      relations: ['user'],
    });
    return channels;
  }


  // Lấy danh sách kênh đăng ký của một người:
  async findListSubscribed(userId: number) {
    const user = await this.channelRepo.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found');
    } else {
      const subscriptions = await this.subsRepo.find({
        where: { user: { id: userId } },
      });
      const channelIds = subscriptions.map(sub => sub.subscribed_id);
      const channels = await this.channelRepo.findByIds(channelIds);
      return channels;
    }
  }

  update(id: number, updateSubscribeDto: UpdateSubscribeDto) {
    return `This action updates a #${id} subscribe`;
  }

  async remove(userId: number, subscribed_id: number) {
    try {
      const find = await this.subsRepo.findOne({
        where: { subscribed_id: subscribed_id, user: { id: userId } },
      });

      if (find) {
        console.log("qe");
        
        await this.subsRepo.remove(find);
      } else {
        throw new NotFoundException('Subscription not found');
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('Subscription not found');
      } else {
        throw new InternalServerErrorException('Failed to remove subscription');
      }
    }
  }
}

