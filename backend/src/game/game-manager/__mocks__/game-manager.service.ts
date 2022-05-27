export const GameManagerService = jest.fn().mockReturnValue({
    getStateObject: jest.fn().mockImplementation(() => null),
    createGameSession: jest.fn().mockImplementation(() => null),
    addNewPlayer: jest.fn(),
    removePlayer: jest.fn(),
    setPlayerSelectedCard: jest.fn(),
    startNextRound: jest.fn(),
});
