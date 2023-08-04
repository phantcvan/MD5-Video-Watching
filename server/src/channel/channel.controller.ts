import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('api/v1/channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) { }

  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Get()
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':email')
  findChannelByEmail(@Param('email') email: string) {
    return this.channelService.findChannelByEmail(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Put('record/:id')
  updateHistoryRecord(@Param('id') id: string) {
    return this.channelService.updateHistoryRecord(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelService.remove(+id);
  }
}
