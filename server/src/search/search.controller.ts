import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';

@Controller('api/v1/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Post()
  create(@Body() createSearchDto: CreateSearchDto) {
    return this.searchService.create(createSearchDto);
  }

  @Get('/all/:channelId')
  findAllByChannelId(@Param('channelId') channelId: string) {
    return this.searchService.findAllByChannelId(+channelId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.searchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSearchDto: UpdateSearchDto) {
    return this.searchService.update(+id, updateSearchDto);
  }

  @Delete(':searchId')
  remove(@Param('searchId') searchId:	string) {
    return this.searchService.remove(+searchId);
  }
}
