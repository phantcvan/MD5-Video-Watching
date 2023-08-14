import { Controller, Get, Post, Body, Put, Param, Delete, Query, Res, UseGuards } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FilterVideoDto } from './entities/filter.entity';
import { Response } from 'express';
import * as path from 'path';
import { AuthGuard } from 'src/auth/guard/auth.guard';

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

  @Get('allByTag/:tag')
  findAllByTag(@Param('tag') tag: string): Promise<any> {
    return this.videoService.findAllByTag(tag);
  }

  @Get('find/search')
  async searchVideos(@Query('q') search: string) {
    return await this.videoService.searchVideos(search);
  }

  @Get('new')
  findNewVideo(): Promise<any> {
    return this.videoService.findNewVideo();
  }
  @Get('newest/:channelId')
  getLatestVideoWithChannelInfo(@Param('channelId') channelId: string): Promise<any> {
    return this.videoService.getLatestVideoWithChannelInfo(+channelId);
  }

  @Get('assets/:imageName')
  async serverImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imagePath = path.join(__dirname, '..', '..', 'public', 'assets', imageName);
    res.sendFile(imagePath);
  }

  @Get(':videoCode')
  findOne(@Param('videoCode') videoCode: string) {
    return this.videoService.findOne(videoCode);
  }

  @Get('search/:keyword')
  searchTitle(@Param('keyword') keyword: string) {
    return this.videoService.searchTitle(keyword);
  }

  @Get('/byId/:videoId')
  findVideobyId(@Param('videoId') videoId: string) {
    return this.videoService.findVideobyId(+videoId);
  }

  @Get('/videosBelongChannel/:channelId')
  findVideobyChannelId(@Param('channelId') channelId: string) {
    return this.videoService.findVideobyChannelId(+channelId);
  }

  @UseGuards(AuthGuard)
  @Put('edit-detail/:videoId')
  update(@Param('videoId') videoId: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+videoId, updateVideoDto);
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
