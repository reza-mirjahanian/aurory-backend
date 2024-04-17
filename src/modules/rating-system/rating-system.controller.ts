import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RatingSystemService } from './rating-system.service';
import { GameResultRequestDto } from './DTOs/game-result.request.dto';

@ApiTags('rating')
@Controller('api')
@ApiResponse({ status: 400, description: 'Bad Request.' })
@ApiResponse({ status: 403, description: 'Forbidden.' })
@ApiResponse({ status: 500, description: 'Internal Server Error.' })
export class RatingSystemController {
  constructor(private readonly ratingSystemService: RatingSystemService) {}

  @Post('/submit-game')
  @ApiOperation({
    summary:
      'Allow clients to submit results of games or matches, which will be to calculate rating.',
  })
  @ApiResponse({
    status: 201,
    description: 'Operation done successfully.',
  })
  async submitGame(@Body() gameResultDto: GameResultRequestDto) {
    //todo 1) Additional check: Winners and losers should not have any common names with each other.
    return this.ratingSystemService.processGameResult(gameResultDto);
  }

  @Get('/player/:userName')
  @ApiOperation({
    summary: 'Allow clients to fetch rating data for a given player',
  })
  @ApiResponse({
    status: 200,
    description: 'Operation done successfully.',
  })
  async getUserData(@Param('userName') userName: string) {
    const player = await this.ratingSystemService.findPlayerInfo(userName);
    if (!player) {
      throw new NotFoundException('No player found for userName: ' + userName);
    } else {
      return player;
    }
  }

  @Get('/top-players/:limit')
  @ApiOperation({
    summary: 'Allow clients to fetch the top 10 players by rating',
  })
  @ApiResponse({
    status: 200,
    description: 'Operation done successfully.',
  })
  async topPlayers(@Param('limit', ParseIntPipe) limit: number) {
    return this.ratingSystemService.findTopPlayers(limit);
  }
}
