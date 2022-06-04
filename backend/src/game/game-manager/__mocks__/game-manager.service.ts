import { Observable } from 'rxjs';

export const GameManagerService = jest.fn().mockReturnValue({
    getStateObject: jest.fn().mockImplementation(() => null),
    createGameSession: jest.fn().mockImplementation(() => null),
    getGameStateObservable: jest.fn().mockImplementation(() => new Observable()),
    addNewPlayer: jest.fn(),
    removePlayer: jest.fn(),
    setPlayerSelectedCard: jest.fn(),
    startNextRound: jest.fn(),
});
