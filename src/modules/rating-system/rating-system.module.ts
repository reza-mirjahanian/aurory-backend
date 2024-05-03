import { Module } from '@nestjs/common';
import { RatingSystemRepository } from './rating-system.repository';
import { RatingSystemService } from './rating-system.service';
import { RatingSystemController } from './rating-system.controller';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RatingSystemRepository, RatingSystemService],
  controllers: [RatingSystemController],
})
export class RatingSystemModule {}
