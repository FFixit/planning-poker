import { GameStage } from './GameStage';
import { TGameStats } from './TGameStats';
import { TPlayerObject } from './TPlayerObject';

export type TGameStateObject = {
    gameStage: GameStage;
    cards: string[];
    gameStats?: TGameStats;
    adminId: string;
    currentTimeLeft?: number;
    timeCreated: string;
    players: { [x: string]: TPlayerObject };
};
