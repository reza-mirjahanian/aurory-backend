import { Test, TestingModule } from '@nestjs/testing';
import { RatingSystemService } from '../rating-system.service';
import { RatingSystemRepository } from '../rating-system.repository';
import {
  findManyPlayersWithRezaReturn,
  game1,
  newPlayers1,
  newPlayers2,
} from './fixtures/unit.tests';

describe('RatingSystemService', () => {
  let repository: RatingSystemRepository;
  let service: RatingSystemService;

  const mockRatingSystemRepository = {
    updatePlayersData: jest.fn(() => 'updatePlayersReturn'),
    insertNewPlayers: jest.fn(() => 'insertNewPlayersReturn'),
    findPlayer: jest.fn(() => 'findPlayerReturn'),
    findTopPlayers: jest.fn(() => 'findTopPlayersReturn'),
    findManyPlayers: jest.fn(() =>
      Promise.resolve(findManyPlayersWithRezaReturn),
    ),
  };

  let mockedUpdatePlayersData;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [RatingSystemService, RatingSystemRepository],
    })
      .overrideProvider(RatingSystemRepository)
      .useValue(mockRatingSystemRepository)
      .compile();

    repository = app.get<RatingSystemRepository>(RatingSystemRepository);
    service = app.get<RatingSystemService>(RatingSystemService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findPlayerInfo()', () => {
    beforeEach(() => {
      jest.spyOn(repository, 'findPlayer');
    });

    it('should call repository.findTopPlayers', async () => {
      const userName = 'reza';
      const result = await service.findPlayerInfo(userName);
      expect(result).toBe('findPlayerReturn');
      expect(repository.findPlayer).toHaveBeenCalledWith(userName);
    });
  });

  describe('findTopPlayers()', () => {
    beforeEach(() => {
      jest.spyOn(repository, 'findTopPlayers');
    });

    it('should call repository.findTopPlayers', async () => {
      const count = 10;
      const result = await service.findTopPlayers(count);
      expect(result).toBe('findTopPlayersReturn');
      expect(repository.findTopPlayers).toHaveBeenCalledWith(count);
    });
  });

  describe('createNewPlayers()', () => {
    beforeEach(() => {
      jest.spyOn(repository, 'insertNewPlayers');
    });

    it('should call repository.insertNewPlayers', async () => {
      const result = await service.createNewPlayers(newPlayers1);
      expect(repository.insertNewPlayers).toHaveBeenCalledWith(newPlayers1);
      expect(result).toBe('insertNewPlayersReturn');
    });
  });

  describe('updatePlayersData()', () => {
    beforeEach(() => {
      jest.spyOn(repository, 'updatePlayersData');
    });

    it('should call repository.updatePlayersData', async () => {
      const result = await service.updatePlayersData(newPlayers2);
      expect(repository.updatePlayersData).toHaveBeenCalledWith(newPlayers2);
      expect(result).toBe('updatePlayersReturn');
    });
  });

  describe('processGameResult()', () => {
    beforeEach(() => {
      jest.spyOn(repository, 'findManyPlayers');
      jest.spyOn(service, 'createNewPlayers');
      mockedUpdatePlayersData = jest.spyOn(service, 'updatePlayersData');
    });

    it('should call repository.updatePlayersData', async () => {
      const result = await service.processGameResult(game1);
      expect(repository.findManyPlayers).toHaveBeenCalledWith([
        'reza',
        'max',
        'ali',
      ]);

      expect(service.createNewPlayers).toHaveBeenCalledWith([
        {
          userName: 'max',
          mu: 25,
          sigma: 8.333333333333334,
          ordinal: 0,
          win: 0,
          lost: 0,
        },
        {
          userName: 'ali',
          mu: 25,
          sigma: 8.333333333333334,
          ordinal: 0,
          win: 0,
          lost: 0,
        },
      ]);

      const callsUpdatePlayersData = mockedUpdatePlayersData.mock.calls[0][0];
      expect(callsUpdatePlayersData).toHaveLength(3);
      const reza = callsUpdatePlayersData.find(
        (player) => player.userName === 'reza',
      );
      const max = callsUpdatePlayersData.find(
        (player) => player.userName === 'max',
      );
      const ali = callsUpdatePlayersData.find(
        (player) => player.userName === 'ali',
      );

      expect(reza.win).toEqual(2);
      expect(reza.lost).toEqual(0);

      expect(ali.win).toEqual(0);
      expect(ali.lost).toEqual(1);

      expect(max.win).toEqual(1);
      expect(max.lost).toEqual(0);

      expect(ali.ordinal).toBeLessThan(max.ordinal);

      expect(result).toBe('updatePlayersReturn');
    });
  });
});
