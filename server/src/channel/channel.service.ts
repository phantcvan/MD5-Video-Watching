import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(@InjectRepository(Channel) private channelRepo: Repository<Channel>) { }

  async create(createChannelDto: CreateChannelDto) {
    try {
      const { email, channelName, joinDate, logoUrl, channelCode, thumbnailM, recordHistory } = createChannelDto
      const channel = await this.channelRepo.findOne({
        where: { email: email }
      })
      if (!channel) {
        const newChannel = this.channelRepo.create({
          email,
          channelName,
          joinDate,
          logoUrl,
          channelCode,
          thumbnailM,
          recordHistory
        })
        // console.log("newChannel", newChannel);
        return await this.channelRepo.save(newChannel);
      }
    } catch (error) {
      console.log("error", error);
      throw new HttpException("Channel with this email already exists", HttpStatus.UNAUTHORIZED);
    }
  }

  findAll() {
    return this.channelRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} channel`;
  }

  findChannelByEmail(email: string) {
    return this.channelRepo.findOne({ where: { email } });
  }


  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  async updateHistoryRecord(id: number) {
    try {
      let find = await this.channelRepo.findOne({
        where: { id },
      });
      let newRecord = find.recordHistory === 0 ? 1 : 0;
      find.recordHistory = newRecord;
      console.log("find", find);
      return await this.channelRepo.save(find);
    } catch (error) {
      console.error('Error occurred while updating history record:', error);
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
