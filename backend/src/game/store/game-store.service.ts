import { Injectable } from '@nestjs/common';
import { GameLib } from '../lib/game-lib';
import GameState from '../structures/GameState';

@Injectable()
export class GameStoreService {
    private games: Map<string, GameState> = new Map();

    constructor(private lib: GameLib) {}

    getSessionOrThrowError(sessionId: string): GameState {
        const game = this.games.get(sessionId);
        if (!game) {
            throw Error('GameStoreService: Game session with ID ' + sessionId + 'does not exist.');
        }
        return game;
    }

    createSession(cards: string[], creatorId: string, creatorPlayerName: string) {
        const sessionId = this.lib.getNextGameId();
        const gameState = new GameState(cards, creatorId, creatorPlayerName);
        this.games.set(sessionId, gameState);
        return sessionId;
    }

    removeSession(sessionId: string) {
        this.games.delete(sessionId);
    }

    getPlayersCurrentSession(clientId: string) {
        for (const [key, gameState] of this.games.entries()) {
            if (gameState.hasPlayer(clientId)) {
                return key;
            }
        }
        return undefined;
    }
}
