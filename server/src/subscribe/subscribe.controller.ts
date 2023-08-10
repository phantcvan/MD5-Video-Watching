import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { UpdateSubscribeDto } from './dto/update-subscribe.dto';

@Controller('api/v1/subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) { }

  @Post()
  create(@Body() createSubscribeDto: CreateSubscribeDto) {
    return this.subscribeService.create(createSubscribeDto);
  }

  @Get()
  findAll() {
    return this.subscribeService.findAll();
  }
  // Lấy danh sách người đăng ký của một kênh:
  @Get('subscriber/:id')
  findListSubscriber(@Param('id') id: string) {
    return this.subscribeService.findListSubscriber(+id);
  }
  // Lấy danh sách kênh đăng ký của một người:
  @Get('subscribed/:id')
  findListSubscribed(@Param('id') id: string) {
    return this.subscribeService.findListSubscribed(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscribeDto: UpdateSubscribeDto) {
    return this.subscribeService.update(+id, updateSubscribeDto);
  }

  @Delete(':userId/:subscribed_id')
  remove(
    @Param('userId') userId: string,
    @Param('subscribed_id') subscribedId: string,
  ) {
    return this.subscribeService.remove(+userId, +subscribedId);
  }
}
