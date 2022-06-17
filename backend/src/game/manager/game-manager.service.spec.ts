import { Test, TestingModule } from '@nestjs/testing';
import { GameLib } from '../lib/game-lib';
import { GameStoreService } from '../store/game-store.service';
import { GameManagerService } from './game-manager.service';

describe('GameManagerService', () => {
    let service: GameManagerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GameManagerService, GameStoreService, GameLib],
        }).compile();

        service = module.get<GameManagerService>(GameManagerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
