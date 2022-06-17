import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameLib } from './lib/game-lib';
import { GameManagerService } from './manager/game-manager.service';

@Module({
    providers: [GameGateway, GameLib, GameManagerService],
})
export class GameModule {}
