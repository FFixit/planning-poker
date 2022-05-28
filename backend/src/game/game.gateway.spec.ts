import { Test, TestingModule } from '@nestjs/testing';
import { GameManagerService } from './game-manager/game-manager.service';
import { GameGateway } from './game.gateway';
import { SelectCardDto } from './dto/select-card.dto';
import { NextRoundDto } from './dto/next-round.dto';
import { LeaveGameDto } from './dto/leave-game.dto';
import { JoinGameDto } from './dto/join-game.dto';
import { CreateGameDto } from './dto/create-game.dto';

jest.mock('./game-manager/game-manager.service');

describe('GameGateway', () => {
    let gateway: GameGateway;
    let gameManagerService: GameManagerService;

    let broadcastState: jest.SpyInstance;

    beforeEach(async () => {
        broadcastState = jest
            .spyOn(GameGateway.prototype as any, 'broadcastState')
            .mockImplementation(() => undefined);

        const module: TestingModule = await Test.createTestingModule({
            providers: [GameGateway, GameManagerService],
        }).compile();

        gateway = module.get<GameGateway>(GameGateway);
        gameManagerService = module.get<GameManagerService>(GameManagerService);

        jest.clearAllMocks();
    });

    describe('handleConnection', () => {
        const client = {
            on: jest.fn(),
        };

        describe('when handleConnection is called', () => {
            beforeEach(() => {
                gateway.handleConnection(client as any);
            });

            test('then it should call Socket.on', () => {
                expect(client.on).toHaveBeenCalledTimes(1);
                expect(client.on.mock.calls[0][0]).toEqual('disconnecting');
                expect(client.on.mock.calls[0][1]).toBeInstanceOf(Function);
            });
        });
    });

    describe('handleDisconnecting', () => {
        const client = {
            rooms: new Set(['room1', 'room2']),
            id: 'testId',
        };
        const reason = 'Test';

        describe('when handleDisconnecting is called', () => {
            let removePlayerMock: jest.SpyInstance;
            beforeEach(() => {
                removePlayerMock = jest
                    .spyOn(gameManagerService, 'removePlayer')
                    .mockImplementation();
                gateway.handleDisconnecting(client as any, reason);
            });

            test('then it should call GameManagerService.removePlayer', () => {
                expect(removePlayerMock).toHaveBeenCalledTimes(2);
                expect(removePlayerMock).nthCalledWith(1, Array.from(client.rooms)[0], client.id);
                expect(removePlayerMock).nthCalledWith(2, Array.from(client.rooms)[1], client.id);
            });

            test('then it should call broadcastState', () => {
                expect(broadcastState).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe('handleCreateGame', () => {
        const sessionId = '123';
        const cards = ['0', 'abc123', '☕'];
        const playerName = 'Player123';
        const messageBody: CreateGameDto = { cards, playerName };
        const client = {
            join: jest.fn(),
            id: 'testId',
        };

        describe('when handleCreateGame is called', () => {
            let result: string;
            let createGameSessionMock: jest.SpyInstance;
            beforeEach(() => {
                createGameSessionMock = jest
                    .spyOn(gameManagerService, 'createGameSession')
                    .mockImplementation(() => sessionId);
                result = gateway.handleCreateGame(messageBody, client as any);
            });

            test('then it should call GameManagerService.createGameSession', () => {
                expect(createGameSessionMock).toHaveBeenCalledTimes(1);
                expect(createGameSessionMock).toHaveBeenCalledWith(cards, playerName, client.id);
            });
            test('then it should call Socket.join', () => {
                expect(client.join).toHaveBeenCalledTimes(1);
                expect(client.join).toHaveBeenCalledWith(sessionId);
            });
            test('then it should call broadcastState', () => {
                expect(broadcastState).toHaveBeenCalledTimes(1);
            });
            test('then it should return sessionId', () => {
                expect(result).toBe(sessionId);
            });
        });
    });

    describe('handleJoinGame', () => {
        const sessionId = '123';
        const playerName = 'Player123';
        const messageBody: JoinGameDto = { sessionId, playerName };
        const client = {
            join: jest.fn(),
            id: 'testId',
        };

        describe('when handleJoinGame is called', () => {
            beforeEach(() => {
                gateway.handleJoinGame(messageBody, client as any);
            });

            test('then it should call GameManagerService.addNewPlayer', () => {
                expect(gameManagerService.addNewPlayer).toHaveBeenCalledTimes(1);
                expect(gameManagerService.addNewPlayer).toHaveBeenCalledWith(
                    messageBody.sessionId,
                    client.id,
                    playerName,
                );
            });
            test('then it should call Socket.join', () => {
                expect(client.join).toHaveBeenCalledTimes(1);
                expect(client.join).toHaveBeenCalledWith(messageBody.sessionId);
            });
            test('then it should call broadcastState', () => {
                expect(broadcastState).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('handleLeaveGame', () => {
        const sessionId = '123';
        const messageBody: LeaveGameDto = { sessionId };
        const client = {
            leave: jest.fn(),
            id: 'testId',
        };

        describe('when handleLeaveGame is called', () => {
            beforeEach(() => {
                gateway.handleLeaveGame(messageBody, client as any);
            });

            test('then it should call GameManagerService.removePlayer', () => {
                expect(gameManagerService.removePlayer).toHaveBeenCalledTimes(1);
                expect(gameManagerService.removePlayer).toHaveBeenCalledWith(
                    messageBody.sessionId,
                    client.id,
                );
            });
            test('then it should call Socket.leave', () => {
                expect(client.leave).toHaveBeenCalledTimes(1);
                expect(client.leave).toHaveBeenCalledWith(messageBody.sessionId);
            });
            test('then it should call broadcastState', () => {
                expect(broadcastState).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('handleSelectCard', () => {
        const sessionId = '123';
        const messageBody: SelectCardDto = { sessionId: sessionId, index: 456 };
        const client = {
            id: 'testId',
        };

        describe('when handleSelectCard is called', () => {
            beforeEach(() => {
                gateway.handleSelectCard(messageBody, client as any);
            });

            test('then it should call GameManagerService.setPlayerSelectedCard', () => {
                expect(gameManagerService.setPlayerSelectedCard).toHaveBeenCalledTimes(1);
                expect(gameManagerService.setPlayerSelectedCard).toHaveBeenCalledWith(
                    messageBody.sessionId,
                    client.id,
                    messageBody.index,
                );
            });
            test('then it should call broadcastState', () => {
                expect(broadcastState).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('handleNextRound', () => {
        const messageBody: NextRoundDto = { sessionId: '123' };
        const client = {
            id: 'testId',
        };

        describe('when handleNextRound is called', () => {
            beforeEach(() => {
                gateway.handleNextRound(messageBody, client as any);
            });

            test('then it should call GameManagerService.startNextRound', () => {
                expect(gameManagerService.startNextRound).toHaveBeenCalledTimes(1);
                expect(gameManagerService.startNextRound).toHaveBeenCalledWith(
                    messageBody.sessionId,
                    client.id,
                );
            });
            test('then it should call broadcastState', () => {
                expect(broadcastState).toHaveBeenCalledTimes(1);
            });
        });
    });
});
