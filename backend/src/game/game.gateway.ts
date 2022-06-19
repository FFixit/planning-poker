import { TGameStateObject } from '../common/types/TGameStateObject';
import { UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { CreateGameDto } from './dto/create-game.dto';
import { JoinGameDto } from './dto/join-game.dto';
import { LeaveGameDto } from './dto/leave-game.dto';
import { NextRoundDto } from './dto/next-round.dto';
import { SelectCardDto } from './dto/select-card.dto';
import { GameManagerService } from './manager/game-manager.service';
import { LogInterceptor } from './log.interceptor';
import { SubscribeGameDto } from './dto/subscribe-game.dto';

@WebSocketGateway({ cors: { origin: '*' } })
@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(new LogInterceptor())
export class GameGateway implements OnGatewayConnection {
    constructor(private gameManager: GameManagerService) {}

    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        client.on('disconnecting', (reason) => this.handleDisconnecting(client, reason));
    }

    handleDisconnecting(client: Socket, reason: string) {
        this.gameManager.removePlayer(client.id);
        console.log('Client disconnecting:', reason);
    }

    @SubscribeMessage('create-game')
    handleCreateGame(
        @MessageBody() { cards, playerName }: CreateGameDto,
        @ConnectedSocket() client: Socket,
    ): string {
        const sessionId = this.gameManager.createGameSession(cards, playerName, client.id);
        return sessionId;
    }

    @SubscribeMessage('join-game')
    handleJoinGame(
        @MessageBody() { sessionId, playerName }: JoinGameDto,
        @ConnectedSocket() client: Socket,
    ): void {
        this.gameManager.addNewPlayer(sessionId, client.id, playerName);
    }

    @SubscribeMessage('subscribe-game')
    handleSubscribeGame(
        @MessageBody() { sessionId }: SubscribeGameDto,
    ): Observable<WsResponse<TGameStateObject>> {
        const gameStateObservable = this.gameManager.getGameStateObservable(sessionId);
        return gameStateObservable.pipe(
            map((gameState) => ({ event: 'subscribe-game', data: gameState })),
        );
    }

    @SubscribeMessage('leave-game')
    handleLeaveGame(
        @MessageBody() { sessionId }: LeaveGameDto,
        @ConnectedSocket() client: Socket,
    ): void {
        this.gameManager.removePlayerFromSession(sessionId, client.id);
    }

    @SubscribeMessage('select-card')
    handleSelectCard(
        @MessageBody() { sessionId, index }: SelectCardDto,
        @ConnectedSocket() client: Socket,
    ): void {
        this.gameManager.setPlayerSelectedCard(sessionId, client.id, index);
    }

    @SubscribeMessage('next-round')
    handleNextRound(
        @MessageBody() { sessionId }: NextRoundDto,
        @ConnectedSocket() client: Socket,
    ): void {
        this.gameManager.startNextRound(sessionId, client.id);
    }
}
