import { Test, TestingModule } from '@nestjs/testing';
import { GameLib } from '../lib/game-lib';
import { GameStoreService } from './game-store.service';

describe('GameStoreService', () => {
    let service: GameStoreService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GameStoreService, GameLib],
        }).compile();

        service = module.get<GameStoreService>(GameStoreService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
