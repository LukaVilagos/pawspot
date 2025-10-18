import { Injectable } from '@nestjs/common';
import Logger from '@pawspot/logger';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
