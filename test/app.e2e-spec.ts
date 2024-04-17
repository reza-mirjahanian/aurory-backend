import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { game1, game2 } from './fixtures/e2e.tests';
import { PrismaClient } from '@prisma/client';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

describe('RatingSystemController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    const prisma = new PrismaClient();
    await prisma.player.deleteMany({});
  });

  // First game
  it('/submit-game (POST) should store data correctly', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/api/submit-game')
      .send(game1)
      .expect(201);

    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(4);
    body.forEach((item) => {
      expect(item).toHaveProperty('userName');
      expect(item).toHaveProperty('mu');
      expect(item).toHaveProperty('sigma');
      expect(item).toHaveProperty('ordinal');
      expect(item).toHaveProperty('win');
      expect(item).toHaveProperty('lost');
      expect(item).toHaveProperty('createdAt');
    });
  });

  // Second game
  it('/submit-game (POST) ', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/api/submit-game')
      .send(game2)
      .expect(201);

    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(2);
    body.forEach((item) => {
      expect(item).toHaveProperty('userName');
      expect(item).toHaveProperty('mu');
      expect(item).toHaveProperty('sigma');
      expect(item).toHaveProperty('ordinal');
      expect(item).toHaveProperty('win');
      expect(item).toHaveProperty('lost');
      expect(item).toHaveProperty('createdAt');
    });
  });

  // Get top players
  it('/top-players/:limit (GET) should returns correct player', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/top-players/3')
      .expect(200);

    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(3);
    body.forEach((item) => {
      expect(item).toHaveProperty('userName');
      expect(item).toHaveProperty('mu');
      expect(item).toHaveProperty('sigma');
      expect(item).toHaveProperty('ordinal');
      expect(item).toHaveProperty('win');
      expect(item).toHaveProperty('lost');
      expect(item).toHaveProperty('createdAt');
    });

    expect(body[0].userName).toBe('reza');
    expect(body[1].userName).toBe('rose');
    expect(body[2].userName).toBe('john');
  });

  // Get player by userName
  it('/player/:userName (GET) should return correct player', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/player/reza')
      .expect(200);

    expect(body).toHaveProperty('userName');
    expect(body).toHaveProperty('mu');
    expect(body).toHaveProperty('sigma');
    expect(body).toHaveProperty('ordinal');
    expect(body).toHaveProperty('win');
    expect(body).toHaveProperty('lost');
    expect(body).toHaveProperty('createdAt');

    expect(body.userName).toBe('reza');
  });

  // Get player that not exist
  it('/player/:userName (GET) should return 404', async () => {
    await request(app.getHttpServer()).get('/api/player/not-exist').expect(404);
  });
});
