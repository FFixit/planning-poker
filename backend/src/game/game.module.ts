import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameManagerService } from './manager/game-manager.service';
import { GameManagerLib } from './manager/game-manager-lib';

@Module({
    providers: [GameGateway, GameManagerLib, GameManagerService],
})
export class GameModule {}
