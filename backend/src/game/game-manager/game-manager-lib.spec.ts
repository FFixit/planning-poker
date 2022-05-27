import { Test, TestingModule } from '@nestjs/testing';
import { GameManagerLib } from './game-manager-lib';

describe('GameMangerLib', () => {
    let provider: GameManagerLib;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GameManagerLib],
        }).compile();

        provider = module.get<GameManagerLib>(GameManagerLib);
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
    });
});
