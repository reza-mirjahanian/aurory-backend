import { Injectable, Logger } from '@nestjs/common';
import { RatingSystemRepository } from './rating-system.repository';
import { rate, rating, ordinal } from 'openskill';

import { GameResultRequestDto } from './DTOs/game-result.request.dto';
import { NewPlayer, PlayerModelPartial } from '../database/types';

@Injectable()
export class RatingSystemService {
  private readonly logger = new Logger(RatingSystemService.name);
  constructor(
    private readonly ratingSystemRepository: RatingSystemRepository,
  ) {}

  async findPlayerInfo(userName: string) {
    return this.ratingSystemRepository.findPlayer(userName);
  }

  async findTopPlayers(count: number = 10) {
    return this.ratingSystemRepository.findTopPlayers(count);
  }

  async processGameResult(gameResultDto: GameResultRequestDto) {
    const { winners, losers } = gameResultDto;

    const usersHistoryMap = await this._generatePlayersHistory(
      [...winners, ...losers].map((x) => x.userName),
    );

    const nonExistencePlayers = [];

    //Prepare MU and Sigma for each winner
    const winnerTeam = [];
    for (const winner of winners) {
      const userName = winner.userName;
      if (usersHistoryMap[userName]) {
        winnerTeam.push(usersHistoryMap[userName]);
      } else {
        const newPlayer = this._initNewPlayer(userName);
        nonExistencePlayers.push(newPlayer);
        winnerTeam.push({ userName, ...newPlayer });
      }
    }

    //Prepare MU and Sigma for each loser
    const loserTeam = [];
    for (const loser of losers) {
      const userName = loser.userName;
      if (usersHistoryMap[userName]) {
        loserTeam.push(usersHistoryMap[userName]);
      } else {
        const newPlayer = this._initNewPlayer(userName);
        nonExistencePlayers.push(newPlayer);
        loserTeam.push({ userName, ...newPlayer });
      }
    }

    if (nonExistencePlayers.length > 0) {
      await this.createNewPlayers(nonExistencePlayers);
    }

    const [winnersRate, losersRate] = rate([winnerTeam, loserTeam]);

    //Update new MU and Sigma for each winner
    for (let i = 0; i < winnersRate.length; i++) {
      const { mu, sigma } = winnersRate[i];
      winnerTeam[i] = {
        ...winnerTeam[i],
        mu,
        sigma,
        ordinal: ordinal({ mu, sigma }),
        win: winnerTeam[i].win + 1,
      };
    }

    //Update new MU and Sigma for each loser
    for (let i = 0; i < losersRate.length; i++) {
      const { mu, sigma } = losersRate[i];
      loserTeam[i] = {
        ...loserTeam[i],
        mu,
        sigma,
        ordinal: ordinal({ mu, sigma }),
        lost: loserTeam[i].lost + 1,
      };
    }

    return this.updatePlayersData([...winnerTeam, ...loserTeam]);
  }

  async createNewPlayers(list: NewPlayer[]) {
    return this.ratingSystemRepository.insertNewPlayers(list);
  }

  async updatePlayersData(data: PlayerModelPartial[]) {
    return this.ratingSystemRepository.updatePlayersData(data);
  }

  private _initNewPlayer(userName: string) {
    const playerRaring = rating();
    return {
      userName,
      ...playerRaring,
      ordinal: ordinal(playerRaring),
      win: 0,
      lost: 0,
    };
  }

  private async _generatePlayersHistory(userNames: string[]) {
    const usersList =
      await this.ratingSystemRepository.findManyPlayers(userNames);
    const table = {};
    for (const record of usersList) {
      table[record.userName] = record;
    }
    return table;
  }
}
