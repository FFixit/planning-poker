import { GameStage } from './GameStage';
import { TPlayerObject } from './TPlayerObject';

export type TGameStateObject = {
    gameStage: GameStage;
    cards: string[];
    gameStats: any;
    adminId: string;
    currentTimeLeft: number;
    timeCreated: string;
    players: { [x: string]: TPlayerObject };
};
