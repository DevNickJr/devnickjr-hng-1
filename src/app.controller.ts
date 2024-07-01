import { Controller, Get, Ip, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { IResponse } from './interface';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  async getHello(
    @Req() request: Request,
    @Ip() ip,
    @Query('visitor_name') visitor_name: string,
  ): Promise<IResponse> {
    console.log('IP Address is: ', ip);
    return await this.appService.getHello(request, ip, visitor_name);
  }
}
