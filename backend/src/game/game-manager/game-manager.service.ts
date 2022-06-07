import { TGameStateObject } from '../../common/types/TGameStateObject';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
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

    getGameStateObservable(sessionId: string): Observable<TGameStateObject> {
        const game: GameState = this.getGameOrThrowError(sessionId);
        return game.getGameStateObservable();
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
        if (!game.hasPlayers()) {
            this.games.delete(sessionId);
        }
    }

    setPlayerSelectedCard(sessionId: string, clientId: string, index: number) {
        const game: GameState = this.getGameOrThrowError(sessionId);
        game.selectPlayerCard(clientId, index);
    }

    startNextRound(sessionId: string, clientId) {
        const game: GameState = this.getGameOrThrowError(sessionId);
        if (clientId === game.getAdmin()) {
            game.resetRound();
        }
    }
}
