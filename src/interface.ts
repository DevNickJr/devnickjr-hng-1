export interface IResponse {
  client_ip: string;
  location: string;
  greeting: string;
  ipAddress?: string;
  requestIP?: string;
  socketIP?: string | string[];
  clientIp?: string;
  value?: any;
}
