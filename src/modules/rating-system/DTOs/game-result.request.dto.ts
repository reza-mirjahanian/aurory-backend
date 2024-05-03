import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsAlphanumeric,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PlayerDto {
  @ApiProperty({
    description: 'User name of Player',
    type: String,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(65)
  @IsAlphanumeric()
  userName: string;
}

export class GameResultRequestDto {
  @ApiProperty({
    description: 'Loser team',
    type: [PlayerDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => PlayerDto)
  losers: PlayerDto[];

  @ApiProperty({
    description: 'Winner team',
    type: [PlayerDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => PlayerDto)
  winners: PlayerDto[];

  // @ApiProperty({
  //   description: 'Id of the game',
  //   type: String,
  //   required: false,
  // })
  // gameId?: string;
}
