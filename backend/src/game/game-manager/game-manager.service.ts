import { Injectable } from '@nestjs/common';
import { GameManagerLib } from './game-manager-lib';
import GameState from './structures/GameState';

@Injectable()
export class GameManagerService {
    constructor(private gameManagerLib: GameManagerLib) {}

    private games: Map<string, GameState> = new Map();

    private getGameOrThrowError(sessionId: string): GameState {
        const game: GameState = this.games.get(sessionId);
        if (!game) {
            throw new Error(
                'GameManagerService: Game session with ID ' + sessionId + 'does not exist.',
            );
        }
        return game;
    }

    getStateObject(sessionId: string): {
        cards: string[];
        isRoundFinished: boolean;
        gameStats: any;
        players: { [x: string]: { name: string; selectedCard: number | true } };
    } {
        const game: GameState = this.getGameOrThrowError(sessionId);
        const stateObject = game.toObject();
        return stateObject;
    }

    createGameSession(cards: string[], creatorPlayerName: string, clientId: string): string {
        const sessionId = this.gameManagerLib.getNextGameId();
        const gameState = new GameState(cards, clientId, creatorPlayerName);
        this.games.set(sessionId, gameState);
        return sessionId;
    }

    addNewPlayer(sessionId: string, clientId: string, playerName: string): void {
        const game: GameState = this.getGameOrThrowError(sessionId);
        game.addPlayer(clientId, playerName);
    }

    removePlayer(sessionId: string, clientId: string): void {
        const game: GameState = this.getGameOrThrowError(sessionId);
        game.removePlayer(clientId);
    }

    setPlayerSelectedCard(sessionId: string, clientId: string, index: number) {
        const game: GameState = this.getGameOrThrowError(sessionId);
        game.selectPlayerCard(clientId, index);
    }

    startNextRound(sessionId: string) {
        const game: GameState = this.getGameOrThrowError(sessionId);
        game.resetRound();
    }
}
