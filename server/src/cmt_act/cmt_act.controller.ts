import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CmtActService } from './cmt_act.service';
import { CreateCmtActDto } from './dto/create-cmt_act.dto';
import { UpdateCmtActDto } from './dto/update-cmt_act.dto';

@Controller('cmt-act')
export class CmtActController {
  constructor(private readonly cmtActService: CmtActService) {}

  @Post()
  create(@Body() createCmtActDto: CreateCmtActDto) {
    return this.cmtActService.create(createCmtActDto);
  }

  @Get()
  findAll() {
    return this.cmtActService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cmtActService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCmtActDto: UpdateCmtActDto) {
    return this.cmtActService.update(+id, updateCmtActDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cmtActService.remove(+id);
  }
}
