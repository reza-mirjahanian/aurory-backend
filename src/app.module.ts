import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RatingSystemModule } from './modules/rating-system/rating-system.module';

@Module({
  imports: [RatingSystemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
