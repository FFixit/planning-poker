import { Injectable } from '@nestjs/common';
import { GameLib } from '../lib/game-lib';
import { LoggerService } from '../logger/logger.service';
import GameState from '../structures/GameState';

@Injectable()
export class GameStoreService {
    private games: Map<string, GameState> = new Map();

    constructor(private lib: GameLib, private logger: LoggerService) {}

    getSessionOrThrowError(sessionId: string): GameState {
        const game = this.games.get(sessionId);
        if (!game) {
            throw Error('GameStoreService: Game session with ID ' + sessionId + 'does not exist.');
        }
        return game;
    }

    createSession(
        cards: string[],
        roundTime: number,
        creatorId: string,
        creatorPlayerName: string,
    ) {
        const sessionId = this.lib.getNextGameId();
        this.logger.write(
            'Creating Session',
            '[' + sessionId + '],',
            'creator name:',
            creatorPlayerName,
        );
        const gameState = new GameState(cards, roundTime, creatorId, creatorPlayerName);
        this.games.set(sessionId, gameState);
        this.logger.write('Current number of sessions:', this.games.size);
        return sessionId;
    }

    removeSession(sessionId: string) {
        this.logger.write('Removing Session', '[' + sessionId + ']');
        this.games.delete(sessionId);
        this.logger.write('Current number of sessions:', this.games.size);
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
