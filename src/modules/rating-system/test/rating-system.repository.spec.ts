import { Test, TestingModule } from '@nestjs/testing';
import { RatingSystemRepository } from '../rating-system.repository';
import { PrismaService } from '../../database/prisma.service';
import { newPlayers1 } from './fixtures/unit.tests';

describe('RatingSystemRepository', () => {
  let repository: RatingSystemRepository;
  let prisma: PrismaService;

  const mockPrismaService = {
    player: {
      update: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, RatingSystemRepository],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    repository = app.get<RatingSystemRepository>(RatingSystemRepository);
    prisma = app.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
  });

  describe('findTopPlayers()', () => {
    beforeEach(() => {
      jest.spyOn(prisma.player, 'findMany');
    });

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

  describe('findPlayer()', () => {
    beforeEach(() => {
      jest.spyOn(prisma.player, 'findFirst');
    });

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

  describe('findManyPlayers()', () => {
    beforeEach(() => {
      jest.spyOn(prisma.player, 'findMany');
    });

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

  describe('insertNewPlayers()', () => {
    beforeEach(() => {
      jest.spyOn(prisma.player, 'createMany');
    });

    it('should call prisma.player.findFirst correctly', async () => {
      await repository.insertNewPlayers(newPlayers1);
      expect(prisma.player.createMany).toHaveBeenCalledWith({
        data: newPlayers1,
        skipDuplicates: true,
      });
    });
  });
});
