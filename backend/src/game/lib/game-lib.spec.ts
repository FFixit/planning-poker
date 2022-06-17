import { Test, TestingModule } from '@nestjs/testing';
import { GameLib } from './game-lib';

describe('GameMangerLib', () => {
    let provider: GameLib;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GameLib],
        }).compile();

        provider = module.get<GameLib>(GameLib);
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
    });
});
