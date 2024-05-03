import { Test, TestingModule } from '@nestjs/testing';
import { RatingSystemRepository } from '../rating-system.repository';
import { PrismaService } from '../../database/prisma.service';
import { newPlayers1, newPlayers2 } from './fixtures/unit.tests';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

describe('RatingSystemRepository', () => {
  let repository: RatingSystemRepository;
  let prisma: PrismaService;
  const prismaMock = mockDeep<PrismaClient>();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, RatingSystemRepository],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    repository = app.get<RatingSystemRepository>(RatingSystemRepository);
    prisma = app.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
  });

  describe('updatePlayersData()', () => {
    beforeEach(() => {
      jest
        .spyOn(prisma, '$transaction')
        .mockImplementation((callback) => callback(prisma));
    });

    it('should call tx.player.update correctly', async () => {
      await repository.updatePlayersData(newPlayers2);
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(prisma.player.update).toHaveBeenCalledTimes(3);
      expect(prisma.player.update).toHaveBeenNthCalledWith(1, {
        where: { userName: newPlayers2[0].userName },
        data: newPlayers2[0],
      });
      expect(prisma.player.update).toHaveBeenNthCalledWith(2, {
        where: { userName: newPlayers2[1].userName },
        data: newPlayers2[1],
      });
      expect(prisma.player.update).toHaveBeenNthCalledWith(3, {
        where: { userName: newPlayers2[2].userName },
        data: newPlayers2[2],
      });
    });
  });

  describe('insertNewPlayers()', () => {
    it('should call prisma.player.findFirst correctly', async () => {
      await repository.insertNewPlayers(newPlayers1);
      expect(prisma.player.createMany).toHaveBeenCalledWith({
        data: newPlayers1,
        skipDuplicates: true,
      });
    });
  });

  describe('findManyPlayers()', () => {
    it('should call prisma.player.findMany() correctly', async () => {
      const userNames = ['Reza', 'max'];
      await repository.findManyPlayers(userNames);
      expect(prisma.player.findMany).toHaveBeenCalledWith({
        where: {
          userName: {
            in: userNames,
          },
        },
      });
    });
  });

  describe('findPlayer()', () => {
    it('should call prisma.player.findFirst correctly', async () => {
      const userName = 'Reza';
      await repository.findPlayer(userName);
      expect(prisma.player.findFirst).toHaveBeenCalledWith({
        where: {
          userName,
        },
      });
    });
  });

  describe('findTopPlayers()', () => {
    it('should call prisma.player.findMany correctly', async () => {
      const count = 5;
      await repository.findTopPlayers(count);
      expect(prisma.player.findMany).toHaveBeenCalledWith({
        orderBy: {
          ordinal: 'desc',
        },
        take: count,
      });
    });

    it('should handle invalid values for count', async () => {
      const count = -5;
      await repository.findTopPlayers(count);
      expect(prisma.player.findMany).toHaveBeenCalledWith({
        orderBy: {
          ordinal: 'desc',
        },
        take: 10,
      });
    });
  });
});
