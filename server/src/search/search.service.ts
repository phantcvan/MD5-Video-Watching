import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Search } from './entities/search.entity';
import { Channel } from 'src/channel/entities/channel.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Search) private searchRepo: Repository<Search>,
    @InjectRepository(Channel) private channelRepo: Repository<Channel>
  ) { }

  async create(createSearchDto: CreateSearchDto) {
    const { searchContent, channelId } = createSearchDto
    const channel = await this.channelRepo.findOne({ where: { id: channelId } })
    const findSearch = await this.searchRepo.findOne({ where: { channel: { id: channelId }, searchContent } })
    const newSearch = { searchContent, channel }
    if (channel) {
      if (findSearch) {
        await this.searchRepo.remove(findSearch)
      }
      return this.searchRepo.save(newSearch)
    } else {
      throw new NotFoundException('Channel not found')
    }
  }

  async findAllByChannelId(channelId: number) {
    const channel = await this.channelRepo.findOne({ where: { id: channelId } })
    if (channel) {
      return this.searchRepo.find({ where: { channel: { id: channelId } }, relations: ['channel'] })
    } else {
      throw new NotFoundException('Channel not found')
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} search`;
  }

  update(id: number, updateSearchDto: UpdateSearchDto) {
    return `This action updates a #${id} search`;
  }

  async remove(searchId: number) {
    const findSearch = await this.searchRepo.findOne({ where: { id: searchId } });
    if (findSearch) {
      return this.searchRepo.remove(findSearch)
    } else {
      throw new NotFoundException('Search Content not found')
    }
  }
}
