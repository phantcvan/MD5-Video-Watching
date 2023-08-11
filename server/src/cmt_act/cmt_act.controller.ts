import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CmtActService } from './cmt_act.service';
import { CreateCmtActDto } from './dto/create-cmt_act.dto';
import { UpdateCmtActDto } from './dto/update-cmt_act.dto';

@Controller('api/v1/cmt-act')
export class CmtActController {
  constructor(private readonly cmtActService: CmtActService) { }

  @Post()
  create(@Body() createCmtActDto: CreateCmtActDto) {
    return this.cmtActService.create(createCmtActDto);
  }

  @Get()
  findAll() {
    return this.cmtActService.findAll();
  }

  @Get(':id')
  findReactionOfCmt(@Param('id') id: string) {
    return this.cmtActService.findReactionOfCmt(+id);
  }

  @Put('')
  update(@Body() updateCmtActDto: UpdateCmtActDto) {
    return this.cmtActService.update(updateCmtActDto);
  }

  @Delete(':cmtId/:channelId')
  remove(@Param('cmtId') cmtId: string, @Param('channelId') channelId: string) {
    return this.cmtActService.remove(+cmtId, +channelId);
  }
}
