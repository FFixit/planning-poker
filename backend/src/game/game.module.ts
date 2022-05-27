import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameManagerService } from './game-manager/game-manager.service';
import { GameManagerLib } from './game-manager/game-manager-lib';

@Module({
    providers: [GameGateway, GameManagerLib, GameManagerService],
})
export class GameModule {}
