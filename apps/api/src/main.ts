import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PawSpotLogger } from './common/logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new PawSpotLogger({
      prefix: 'PawSpot API',
      timestamp: true,
    })
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
