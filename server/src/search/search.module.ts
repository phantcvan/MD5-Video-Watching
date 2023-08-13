import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Search } from './entities/search.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Search, Channel]), JwtModule],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule { }
