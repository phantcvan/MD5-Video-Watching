import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Video } from '../video/entities/video.entity';
import { Tag } from './entities/tag.entity';

@Controller('api/v1/tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':tag')
  async findAllVideoWithTagInfo(@Param('tag') tag: string): Promise<Video[]> {
    return this.tagService.findAllVideoWithTagInfo(tag);
  }

  @Get('tagForVideo/:videoId')
  async findAllTagBelongVideo(@Param('videoId') videoId: string): Promise<Tag[]> {
    return this.tagService.findAllTagBelongVideo(+videoId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
