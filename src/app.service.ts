import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';
import { IResponse } from './interface';

@Injectable()
export class AppService {
  async getHello(
    request: Request,
    ip: string,
    name: string,
  ): Promise<IResponse> {
    const ipAddress = ip;
    const requestIP = request?.ip;
    const socketIP = request?.socket?.remoteAddress?.split(':');
    console.log({
      ipAddress,
      requestIP,
      socketIP,
    })
    const ipVal = socketIP[socketIP.length - 1];
    try {
      const res = await fetch(`https://ipapi.co/${ipVal}/json/`);
      const value = await res.json();
      console.log({ value });
      return {
        client_ip: ipVal, // The IP address of the requester
        location: value?.city, // The city of the requester
        greeting: `Hello, ${name}!, the temperature is 11 degrees Celcius in ${value?.city}`,
      };
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException(
        'An error occured while getting location',
      );
    }
  }
}
