import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameLib } from './lib/game-lib';
import { LoggerService } from './logger/logger.service';
import { GameManagerService } from './manager/game-manager.service';
import { GameStoreService } from './store/game-store.service';

@Module({
    providers: [GameGateway, GameLib, GameManagerService, GameStoreService, LoggerService],
})
export class GameModule {}
