import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';

@Controller('api/v1/reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) { }

  @Post()
  create(@Body() createReactionDto: CreateReactionDto) {
    return this.reactionService.create(createReactionDto);
  }

  @Get('/allLike/:videoId')
  findLikeByVideoId(@Param('videoId') videoId: string) {
    return this.reactionService.findLikeByVideoId(+videoId);
  }

  @Get('/reactionOfVideo/:videoId/:channelId')
  findOneByVideo(@Param('videoId') videoId: string,
    @Param('channelId') channelId: string) {
    return this.reactionService.findOneByVideo(+videoId, +channelId);
  }

  @Get('/filterByChannelId/:id')
  findAllByChannelId(@Param('id') id: string) {
    return this.reactionService.findAllByChannelId(+id);
  }

  @Put('')
  update(@Body() updateReactionDto: UpdateReactionDto) {
    return this.reactionService.update(updateReactionDto);
  }

  @Delete('/:videoId/:channelId')
  remove(@Param('videoId') videoId: string,
    @Param('channelId') channelId: string) {
    return this.reactionService.remove(+videoId, +channelId);
  }
}
