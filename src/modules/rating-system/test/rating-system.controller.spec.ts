import { Test, TestingModule } from '@nestjs/testing';
import { RatingSystemController } from '../rating-system.controller';
import { RatingSystemService } from '../rating-system.service';
import { game1 } from './fixtures/unit.tests';

describe('RatingSystemController', () => {
  let controller: RatingSystemController;
  let service: RatingSystemService;

  const mockedFindPlayerInfo = jest.fn(() => ({ userName: 'reza' }));
  const mockRatingSystemService = {
    processGameResult: jest.fn(),
    findPlayerInfo: mockedFindPlayerInfo,
    findTopPlayers: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RatingSystemController],
      providers: [RatingSystemService],
    })
      .overrideProvider(RatingSystemService)
      .useValue(mockRatingSystemService)
      .compile();

    controller = app.get<RatingSystemController>(RatingSystemController);
    service = app.get<RatingSystemService>(RatingSystemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('submitGame()', () => {
    beforeEach(() => {
      jest.spyOn(service, 'processGameResult');
    });

    it('should be defined', () => {
      expect(service.processGameResult).toBeDefined();
    });

    it('should call service.processGameResult', () => {
      controller.submitGame(game1);
      expect(service.processGameResult).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserData()', () => {
    beforeEach(() => {
      jest.spyOn(service, 'findPlayerInfo');
    });

    it('should be defined', () => {
      expect(service.findPlayerInfo).toBeDefined();
    });

    it('should call service.processGameResult', () => {
      controller.getUserData('reza');
      expect(service.findPlayerInfo).toHaveBeenCalledTimes(1);
      expect(service.findPlayerInfo).toHaveBeenCalledWith('reza');
    });

    it('should call service.processGameResult returns notFound when the user does not exist.', () => {
      mockedFindPlayerInfo.mockClear();
      mockedFindPlayerInfo.mockImplementationOnce(() => null);
      expect(
        async () => await controller.getUserData('reza'),
      ).rejects.toThrow();
      expect(service.findPlayerInfo).toHaveBeenCalledTimes(1);
    });
  });

  describe('topPlayers()', () => {
    beforeEach(() => {
      jest.spyOn(service, 'findPlayerInfo');
    });

    it('should be defined', () => {
      expect(service.findPlayerInfo).toBeDefined();
    });

    it('should call service.findTopPlayers', () => {
      controller.topPlayers(10);
      expect(service.findTopPlayers).toHaveBeenCalledTimes(1);
      expect(service.findTopPlayers).toHaveBeenCalledWith(10);
    });
  });
});
