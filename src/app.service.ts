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
    const headers = request.headers['x-forwarded-for'];
    let socketIP = request?.socket?.remoteAddress;
    if (socketIP.includes('::f')) {
      const val = socketIP.split(':');
      socketIP = val[val.length - 1];
    }
    let headerIp = '';
    if (Array.isArray(typeof headers)) {
      headerIp = headers[0];
    }
    const finalIp = headerIp || socketIP || ip;
    try {
      const res = await fetch(`
        http://api.weatherapi.com/v1/current.json?key=ca09e70b584049009be103752240407&q=${finalIp}
      `);
      const value = await res.json();
      return {
        client_ip: finalIp, // The IP address of the requester
        location: value?.location?.name, // The city of the requester
        greeting: `Hello, ${name}!, the temperature is ${value?.current?.temp_c} degrees Celcius in ${value?.location?.name}`,
      };
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException(
        'An error occured while getting location',
      );
    }
  }
}
