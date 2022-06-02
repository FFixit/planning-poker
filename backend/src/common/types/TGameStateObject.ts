import { GameStage } from './GameStage';
import { TPlayerObject } from './TPlayerObject';

export type TGameStateObject = {
    gameStage: GameStage;
    cards: string[];
    gameStats: any;
    adminId: string;
    currentTimeLeft: number;
    players: { [x: string]: TPlayerObject };
};
