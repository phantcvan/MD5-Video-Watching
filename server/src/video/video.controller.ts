import { Controller, Get, Post, Body, Put, Param, Delete, Query, Res } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FilterVideoDto } from './entities/filter.entity';
import { Response } from 'express';
import * as path from 'path';

@Controller('api/v1/videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) { }

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto);
  }

  @Get('all/:start')
  findAll(@Param('start') start: string): Promise<any> {
    return this.videoService.findAll(start);
  }
  @Get('new')
  findNewVideo(): Promise<any> {
    return this.videoService.findNewVideo();
  }

  @Get('assets/:imageName')
  async serveImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imagePath = path.join(__dirname, '..', '..', 'public', 'assets', imageName);
    res.sendFile(imagePath);
  }

  @Get(':videoCode')
  findOne(@Param('videoCode') videoCode: string) {
    return this.videoService.findOne(videoCode);
  }

  @Get('/videosBelongChannel/:channelId')
  findVideobyChannelId(@Param('channelId') channelId: string) {
    return this.videoService.findVideobyChannelId(+channelId);
  }


  @Put('view/:videoCode')
  updateView(@Param('videoCode') videoCode: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.updateView(videoCode, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}
