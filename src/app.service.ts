import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';
import { IResponse } from './interface';

@Injectable()
export class AppService {
  async getClientIp(request: Request) {
    let ipAddress = request?.ip || request?.socket?.remoteAddress;

    if (ipAddress && ipAddress.startsWith('::ffff:')) {
      // Extract the IPv4 part from the IPv4-mapped IPv6 address
      ipAddress = ipAddress.split(':').pop();
    }

    return ipAddress;
  }

  async getHello(
    request: Request,
    ip: string,
    name: string,
  ): Promise<IResponse> {
    const ipAddress = ip;
    const heaerdIp = request.headers;
    const requestIP = request?.ip;
    let socketIP = request?.socket?.remoteAddress;
    if (socketIP.includes('::f')) {
      const val = socketIP.split(':');
      socketIP = val[val.length - 1];
    }
    console.log({
      ipAddress,
      requestIP,
      socketIP,
      heaerdIp,
    });
    try {
      const res = await fetch(`
        http://api.weatherapi.com/v1/ip.json?key=ca09e70b584049009be103752240407&q=${socketIP || requestIP || socketIP}
      `);
      // const res = await fetch(`https://ipapi.co/${clientIp || heaerdIp || ipVal || requestIP}/json/`);
      const value = await res.json();
      console.log({ value });
      return {
        client_ip: socketIP, // The IP address of the requester
        location: value?.city, // The city of the requester
        greeting: `Hello, ${name}!, the temperature is 11 degrees Celcius in ${value?.city}`,
        // ipAddress,
        // requestIP,
        // socketIP,
        // clientIp,
        // value,
      };
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException(
        'An error occured while getting location',
      );
    }
  }
}
