import { Test, TestingModule } from '@nestjs/testing';
import { GameLib } from '../lib/game-lib';
import GameState from '../structures/GameState';
import { GameStoreService } from './game-store.service';

describe('GameStoreService', () => {
    const mockSessionId = 'abc123';
    let gameStoreService: GameStoreService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GameStoreService],
        })
            .useMocker((token) => {
                if (token === GameLib) {
                    return {
                        getNextGameId: jest.fn().mockReturnValue(mockSessionId),
                    };
                }
            })
            .compile();

        gameStoreService = module.get<GameStoreService>(GameStoreService);

        jest.clearAllMocks();
    });

    describe('getSessionOrThrowError', () => {
        const cards = ['0', 'abc123', '☕'];
        const creatorId = 'testId';
        const creatorName = 'Player123';
        describe('when getSessionOrThrowError is called with existing session', () => {
            let game: GameState;
            let gameState: GameState;
            beforeEach(() => {
                gameState = new GameState(cards, creatorId, creatorName);
                gameStoreService['games'] = new Map();
                gameStoreService['games'].set(mockSessionId, gameState);
                game = gameStoreService.getSessionOrThrowError(mockSessionId);
            });

            test('then it should return the correct GameState', () => {
                expect(game).toBe(gameState);
            });
        });

        describe('when getSessionOrThrowError is called with non existant session', () => {
            let caller: () => GameState;
            beforeEach(() => {
                gameStoreService['games'] = new Map();
                caller = () => gameStoreService.getSessionOrThrowError(mockSessionId);
            });

            test('then it should throw an error', () => {
                expect(caller).toThrowError();
            });
        });
    });

    describe('createSession', () => {
        const cards = ['0', 'abc123', '☕'];
        const creatorId = 'testId';
        const creatorName = 'Player123';

        describe('when createSession is called', () => {
            let sessionId: string;
            beforeEach(() => {
                gameStoreService['games'] = new Map();
                sessionId = gameStoreService.createSession(cards, creatorId, creatorName);
            });

            test('then it should return the sessionId', () => {
                expect(sessionId).toEqual(mockSessionId);
            });

            test('then it should create a GameState', () => {
                expect(gameStoreService['games'].size).toBe(1);
            });
        });
    });
    describe('removeSession', () => {
        const cards = ['0', 'abc123', '☕'];
        const creatorId = 'testId';
        const creatorName = 'Player123';

        describe('when removeSession is called', () => {
            beforeEach(() => {
                const gameState = new GameState(cards, creatorId, creatorName);
                gameStoreService['games'] = new Map();
                gameStoreService['games'].set(mockSessionId, gameState);
                gameStoreService.removeSession(mockSessionId);
            });

            test('then it should remove a GameSession', () => {
                expect(gameStoreService['games'].size).toBe(0);
            });
        });
    });
    describe('getPlayersCurrentSession', () => {
        const cards = ['0', 'abc123', '☕'];
        const creatorId = 'testId';
        const creatorName = 'Player123';

        describe('when getPlayersCurrentSession is called', () => {
            let sessionId: string;
            beforeEach(() => {
                const gameState = new GameState(cards, creatorId, creatorName);
                gameStoreService['games'] = new Map();
                gameStoreService['games'].set(mockSessionId, gameState);
                sessionId = gameStoreService.getPlayersCurrentSession(creatorId);
            });

            test('then it should return the right sessionId', () => {
                expect(sessionId).toEqual(mockSessionId);
            });
        });
    });
});
