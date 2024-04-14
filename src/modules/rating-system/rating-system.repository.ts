import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NewPlayer, PlayerModelPartial } from '../database/types';

@Injectable()
export class RatingSystemRepository {
  private readonly logger = new Logger(RatingSystemRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async updatePlayersData(data: PlayerModelPartial[]) {
    this.logger.debug(`Update ${data.length} players`);

    return this.prisma.$transaction(async (tx) => {
      return Promise.all(
        data.map((record) => {
          return tx.player.update({
            where: {
              userName: record.userName,
            },
            data: record,
          });
        }),
      );
    });
  }

  async insertNewPlayers(list: NewPlayer[]) {
    this.logger.debug(`Creating  ${list.length}  new players`);
    return this.prisma.player.createMany({
      data: list,
      skipDuplicates: true,
    });
  }

  async findManyPlayers(userNames: string[]) {
    this.logger.debug('Find players with username');
    return this.prisma.player.findMany({
      where: {
        userName: {
          in: userNames,
        },
      },
    });
  }

  async findPlayer(userName: string) {
    this.logger.debug(`Find a player with username: ${userName}`);
    return this.prisma.player.findFirst({
      where: {
        userName,
      },
    });
  }

  async findTopPlayers(count: number) {
    if (count < 1 || count > 1000) {
      // Validation
      count = 10;
    }
    this.logger.debug(`Find top ${count} players`);
    return this.prisma.player.findMany({
      orderBy: {
        ordinal: 'desc',
      },
      take: count,
    });
  }
}
