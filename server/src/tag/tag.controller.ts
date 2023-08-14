import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Video } from '../video/entities/video.entity';
import { Tag } from './entities/tag.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('api/v1/tag')
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get('withTag/:tag')
  async findAllVideoWithTagInfo(@Param('tag') tag: string): Promise<Video[]> {
    return this.tagService.findAllVideoWithTagInfo(tag);
  }

  @Get('search/:keyword')
  async searchTag(@Param('keyword') keyword: string) {
    return this.tagService.searchTag(keyword);
  }

@Get('withoutTag/:tag')
async findAllVideoWithoutTagInfo(@Param('tag') tag: string): Promise < Video[] > {
  return this.tagService.findAllVideoWithoutTagInfo(tag);
}

@Get('tagForVideo/:videoId')
async findAllTagBelongVideo(@Param('videoId') videoId: string): Promise < Tag[] > {
  return this.tagService.findAllTagBelongVideo(+videoId);
}

@UseGuards(AuthGuard)
@Put(':videoId')
update(@Param('videoId') videoId: string, @Body() updateTagDto: UpdateTagDto) {
  return this.tagService.update(+videoId, updateTagDto);
}

@UseGuards(AuthGuard)
@Delete(':id')
remove(@Param('id') id: string) {
  return this.tagService.remove(+id);
}
}
