import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameDataService {
  private gameData: any;

  setGameData(data: any): void {
    this.gameData = data;
  }

  getGameData(): any {
    return this.gameData;
  }
}
