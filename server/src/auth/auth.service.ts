import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { NotFoundError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ChannelService } from 'src/channel/channel.service';
import * as jwt from 'jsonwebtoken';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(private channelService: ChannelService,
    private jwtService: JwtService) { }

  async signIn(signInDto: CreateAuthDto) {
    let { email } = signInDto;
    let find = await this.channelService.findChannelByEmail(email);
    if (find) {
      const payload = { id: find.id, email: find.email };
      const access_token = await this.jwtService.signAsync(payload);
      return { access_token };
    } else {
      throw new BadRequestException("User with this email had not exist")
    }
  }

  async signUp(signInDto: CreateAuthDto) {
    let { email } = signInDto;
    let find = await this.channelService.findChannelByEmail(email);
    let channels = await this.channelService.findAll();
    let channelCount = channels.length + 1
    if (!find) {
      const payload = { id: channelCount, email: email };
      const access_token = await this.jwtService.signAsync(payload);
      return { access_token };
    } else {
      throw new BadRequestException("User with this email already exists")
    }
  }

  async getProfile(request) {
    const user = request.user;
    const userEmail = user.email;
    // console.log("request.user", userEmail);
    return await this.channelService.findChannelByEmail(userEmail);
  }
}

