import { firstValueFrom, Observable, Subject } from 'rxjs';
import { GameStage } from 'src/common/types/GameStage';
import { TGameStateObject } from 'src/common/types/TGameStateObject';
import GameState from './GameState';
import Player from './Player';

describe('GameMangerLib', () => {
    let gameState: GameState;

    const cards = ['0', 'abc123', '☕'];
    const creatorId = 'testId';
    const creatorName = 'Player123';

    beforeEach(async () => {
        gameState = new GameState(cards, creatorId, creatorName);

        jest.clearAllMocks();
    });

    describe('getGameStateObservable', () => {
        let observable: Observable<TGameStateObject>;
        describe('when getGameStateObservable is called', () => {
            beforeEach(() => {
                observable = gameState.getGameStateObservable();
            });

            test('then it should return an Observable', () => {
                expect(observable).toBeInstanceOf(Observable);
            });
            test('then it should include the first gameStateObject', async () => {
                const firstObject: TGameStateObject = await firstValueFrom(observable);
                expect(firstObject.cards).toEqual(cards);
                expect(firstObject.adminId).toEqual(creatorId);
            });
        });
    });

    describe('addPlayer', () => {
        describe('when addPlayer is called with existing id', () => {
            let caller: () => void;
            beforeEach(() => {
                caller = () => {
                    gameState.addPlayer(creatorId, creatorName);
                };
            });

            test('then it should throw an error', () => {
                expect(caller).toThrowError();
            });
        });
        describe('when addPlayer is called with new id', () => {
            let mockPushState;
            let mockSetGameStage;
            beforeAll(() => {
                mockPushState = jest
                .spyOn(GameState.prototype as any, 'pushState')
                .mockImplementation();
                mockSetGameStage = jest.spyOn(GameState.prototype as any, 'setGameStage');
            });

            beforeEach(() => {
                gameState.addPlayer(creatorId + '123', creatorName);
            });

            test('then it should add a new Player', () => {
                expect(gameState['players'].size).toBe(2);
            });
            test('then it should call setGameStage', () => {
                expect(mockSetGameStage).toHaveBeenCalledTimes(1);
            });
            test('then it should call pushState', () => {
                expect(mockPushState).toHaveBeenCalledTimes(1);
            });

            afterAll(() => {
                mockPushState.mockRestore();
                mockSetGameStage.mockRestore();
            });
        });
    });

    describe('removePlayer', () => {
        describe('when removePlayer is called with existing id', () => {
            let mockPushState;
            let mockComplete;
            beforeAll(() => {
                mockPushState = jest
                .spyOn(GameState.prototype as any, 'pushState')
                .mockImplementation();
                mockComplete = jest.spyOn(Subject.prototype, 'complete').mockImplementation();
            });

            beforeEach(() => {
                gameState.removePlayer(creatorId);
            });

            test('then it should remove a Player', () => {
                expect(gameState['players'].size).toBe(0);
            });
            test('then it should call pushState', () => {
                expect(mockPushState).toHaveBeenCalledTimes(1);
            });
            test('then it should call Subject.complete', () => {
                expect(mockComplete).toHaveBeenCalledTimes(1);
            });

            afterAll(() => {
                mockPushState.mockRestore();
                mockComplete.mockRestore();
            });
        });
        describe('when removePlayer is called with non existing id', () => {
            let mockPushState;
            beforeAll(() => {
                mockPushState = jest.spyOn(GameState.prototype as any, 'pushState');
            });

            beforeEach(() => {
                gameState.removePlayer(creatorId + '123');
            });

            test('then it should not remove a Player', () => {
                expect(gameState['players'].size).toBe(1);
            });
            test('then it should not call pushState', () => {
                expect(mockPushState).not.toHaveBeenCalled();
            });

            afterAll(() => {
                mockPushState.mockRestore();
            });
        });
    });

    describe('hasPlayers', () => {
        describe('when hasPlayers is called players.size>0', () => {
            let returnedValue: boolean;
            beforeEach(() => {
                returnedValue = gameState.hasPlayers();
            });

            test('then it should return true', () => {
                expect(returnedValue).toEqual(true);
            });
        });
        describe('when hasPlayers is called players.size=0', () => {
            let returnedValue: boolean;
            beforeEach(() => {
                gameState['players'] = new Map();
                returnedValue = gameState.hasPlayers();
            });

            test('then it should return false', () => {
                expect(returnedValue).toEqual(false);
            });
        });
    });

    describe('getAdmin', () => {
        describe('when getAdmin is called', () => {
            let returnedValue: string;
            beforeEach(() => {
                returnedValue = gameState.getAdmin();
            });

            test('then it should return adminId', () => {
                expect(returnedValue).toEqual(creatorId);
            });
        });
    });

    describe('selectPlayerCard', () => {
        let mockSetSelectedCard;
        let mockPushState;
        beforeAll(() => {
            mockSetSelectedCard = jest
            .spyOn(Player.prototype, 'setSelectedCard')
            .mockImplementation();
            mockPushState = jest
            .spyOn(GameState.prototype as any, 'pushState')
            .mockImplementation();
        });

        const index = 1;
        describe('when selectPlayerCard is called with gameStage=GameStage.RoundInProgress', () => {
            beforeEach(() => {
                gameState['gameStage'] = GameStage.RoundInProgress;
                gameState.selectPlayerCard(creatorId, index);
            });

            test('then it should call pushState', () => {
                expect(mockPushState).toHaveBeenCalledTimes(1);
            });
            test('then it should call Player.setSelectedCard', () => {
                expect(mockSetSelectedCard).toHaveBeenCalledTimes(1);
                expect(mockSetSelectedCard).toHaveBeenCalledWith(index);
            });
        });
        describe('when selectPlayerCard is called with gameStage!=GameStage.RoundInProgress', () => {
            beforeEach(() => {
                gameState['gameStage'] = GameStage.WaitingForPlayers;
                gameState.selectPlayerCard(creatorId, index);
            });

            test('then it should not call pushState', () => {
                expect(mockPushState).not.toHaveBeenCalled();
            });
            test('then it should not call Player.setSelectedCard', () => {
                expect(mockSetSelectedCard).not.toHaveBeenCalled();
            });
        });

        afterAll(() => {
            mockSetSelectedCard.mockRestore();
            mockPushState.mockRestore();
        });
    });

    describe('resetRound', () => {
        let mockSetSelectedCard;
        let mockPushState;
        let mockSetGameStage;
        let mockStartTimer;
        beforeAll(() => {
            mockSetSelectedCard = jest
            .spyOn(Player.prototype, 'setSelectedCard')
            .mockImplementation();
            mockPushState = jest
            .spyOn(GameState.prototype as any, 'pushState')
            .mockImplementation();
            mockSetGameStage = jest
            .spyOn(GameState.prototype as any, 'setGameStage')
            .mockImplementation();
            mockStartTimer = jest
            .spyOn(GameState.prototype as any, 'startTimer')
            .mockImplementation();
        });

        describe('when resetRound is called with gameStage=GameStage.WaitingForStart', () => {
            beforeEach(() => {
                gameState['gameStage'] = GameStage.WaitingForStart;
                gameState.resetRound();
            });

            test('then it should call Player.setSelectedCard', () => {
                expect(mockSetSelectedCard).toHaveBeenCalledTimes(1);
            });
            test('then it should set gameStats to null', () => {
                expect(gameState['gameStats']).toEqual(null);
            });
            test('then it should call setGameStage', () => {
                expect(mockSetGameStage).toHaveBeenCalledTimes(1);
                expect(mockSetGameStage).toHaveBeenCalledWith(GameStage.RoundInProgress);
            });
            test('then it should call pushState', () => {
                expect(mockPushState).toHaveBeenCalledTimes(1);
            });
            test('then it should call startTimer', () => {
                expect(mockStartTimer).toHaveBeenCalledTimes(1);
            });
        });
        describe('when resetRound is called with gameStage=GameStage.RoundFinished', () => {
            beforeEach(() => {
                gameState['gameStage'] = GameStage.RoundFinished;
                gameState.resetRound();
            });

            test('then it should call Player.setSelectedCard', () => {
                expect(mockSetSelectedCard).toHaveBeenCalledTimes(1);
            });
            test('then it should set gameStats to null', () => {
                expect(gameState['gameStats']).toEqual(null);
            });
            test('then it should call setGameStage', () => {
                expect(mockSetGameStage).toHaveBeenCalledTimes(1);
                expect(mockSetGameStage).toHaveBeenCalledWith(GameStage.RoundInProgress);
            });
            test('then it should call pushState', () => {
                expect(mockPushState).toHaveBeenCalledTimes(1);
            });
            test('then it should call startTimer', () => {
                expect(mockStartTimer).toHaveBeenCalledTimes(1);
            });
        });
        describe('when resetRound is called with gameStage=GameStage.WaitingForPlayers', () => {
            beforeEach(() => {
                gameState['gameStage'] = GameStage.WaitingForPlayers;
                gameState.resetRound();
            });

            test('then it should not call Player.setSelectedCard', () => {
                expect(mockSetSelectedCard).not.toHaveBeenCalled();
            });
            test('then it should not call setGameStage', () => {
                expect(mockSetGameStage).not.toHaveBeenCalled();
            });
            test('then it should not call pushState', () => {
                expect(mockPushState).not.toHaveBeenCalled();
            });
            test('then it should not call startTimer', () => {
                expect(mockStartTimer).not.toHaveBeenCalled();
            });
        });
        describe('when resetRound is called with gameStage=GameStage.RoundInProgress', () => {
            beforeEach(() => {
                gameState['gameStage'] = GameStage.RoundInProgress;
                gameState.resetRound();
            });

            test('then it should not call Player.setSelectedCard', () => {
                expect(mockSetSelectedCard).not.toHaveBeenCalled();
            });
            test('then it should not call setGameStage', () => {
                expect(mockSetGameStage).not.toHaveBeenCalled();
            });
            test('then it should not call pushState', () => {
                expect(mockPushState).not.toHaveBeenCalled();
            });
            test('then it should not call startTimer', () => {
                expect(mockStartTimer).not.toHaveBeenCalled();
            });
        });

        afterAll(() => {
            mockSetSelectedCard.mockRestore();
            mockPushState.mockRestore();
            mockSetGameStage.mockRestore();
            mockStartTimer.mockRestore();
        });
    });

    describe('toObject', () => {
        describe('when toObject is called', () => {
            const expecedObject = {
                adminId: 'testId',
                cards: ['0', 'abc123', '☕'],
                currentTimeLeft: null,
                gameStage: 0,
                gameStats: null,
                players: {
                    testId: {
                        name: 'Player123',
                        selectedCard: undefined,
                    },
                },
                timeCreated: expect.any(String),
            };
            let returnedValue: TGameStateObject;

            beforeEach(() => {
                returnedValue = gameState.toObject();
            });

            test('then it should return the expected Object', () => {
                expect(returnedValue).toEqual(expect.objectContaining(expecedObject));
            });
        });
    });
});
