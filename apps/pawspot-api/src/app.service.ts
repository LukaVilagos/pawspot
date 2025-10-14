import { Injectable } from '@nestjs/common';
import Logger from '@pawspot/logger';

@Injectable()
export class AppService {
  getHello(): string {
    Logger('getHello method called');
    return 'Hello World!';
  }
}
