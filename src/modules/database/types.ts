import { Prisma } from '@prisma/client';

export type PlayerModel = Prisma.PlayerGetPayload<{
  select: {
    [K in keyof Required<Prisma.PlayerSelect>]: true;
  };
}>;

export type NewPlayer = Pick<
  PlayerModel,
  'userName' | 'mu' | 'sigma' | 'ordinal'
>;

export type PlayerModelPartial = Partial<PlayerModel>;
