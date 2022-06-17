import { TGameStateObject } from '../../common/types/TGameStateObject';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GameStoreService } from '../store/game-store.service';

@Injectable()
export class GameManagerService {
    constructor(private gameStore: GameStoreService) {}

    getGameStateObservable(sessionId: string): Observable<TGameStateObject> {
        const game = this.gameStore.getSessionOrThrowError(sessionId);
        return game.getGameStateObservable();
    }

    createGameSession(cards: string[], creatorPlayerName: string, clientId: string): string {
        const sessionId = this.gameStore.createSession(cards, clientId, creatorPlayerName);
        return sessionId;
    }

    addNewPlayer(sessionId: string, clientId: string, playerName: string): void {
        const game = this.gameStore.getSessionOrThrowError(sessionId);
        game.addPlayer(clientId, playerName);
    }

    removePlayer(sessionId: string, clientId: string): void {
        const game = this.gameStore.getSessionOrThrowError(sessionId);
        game.removePlayer(clientId);
        if (!game.hasPlayers()) {
            this.gameStore.removeSession(sessionId);
        }
    }

    setPlayerSelectedCard(sessionId: string, clientId: string, index: number) {
        const game = this.gameStore.getSessionOrThrowError(sessionId);
        game.selectPlayerCard(clientId, index);
    }

    startNextRound(sessionId: string, clientId) {
        const game = this.gameStore.getSessionOrThrowError(sessionId);
        if (clientId === game.getAdmin()) {
            game.resetRound();
        }
    }
}
