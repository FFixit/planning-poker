import { GameStage } from './GameStage';
import { TPlayerObject } from './TPlayerObject';

export type TGameStateObject = {
    gameStage: GameStage;
    cards: string[];
    gameStats?: {
        average?: number;
        median?: number;
        others: { key: string; count: number }[];
    };
    adminId: string;
    currentTimeLeft?: number;
    timeCreated: string;
    players: { [x: string]: TPlayerObject };
};
