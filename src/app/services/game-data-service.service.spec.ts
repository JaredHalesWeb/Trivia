import { TestBed } from '@angular/core/testing';

import { GameDataServiceService } from './game-data-service.service';

describe('GameDataServiceService', () => {
  let service: GameDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
