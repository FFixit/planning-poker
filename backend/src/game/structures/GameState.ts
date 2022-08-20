import { GameStage } from '../../common/types/GameStage';
import { TGameStateObject } from '../../common/types/TGameStateObject';
import { concatWith, interval, Observable, of, Subject } from 'rxjs';
import { take, map, finalize } from 'rxjs/operators';
import Player from './Player';
import { TGameStats } from 'src/common/types/TGameStats';
import { TPlayerObject } from 'src/common/types/TPlayerObject';

export default class GameState {
    private gameStage: GameStage;
    private players: Map<string, Player> = new Map();
    private adminId: string;
    private cards: Array<string> = [];
    private timeCreated: Date;
    private gameStats: TGameStats = null;
    private subject: Subject<TGameStateObject>;
    private roundTime: number;
    private currentTimeLeft: number = null;

    constructor(
        cards: string[],
        roundTime: number,
        firstPlayerId: string,
        firstPlayerName: string,
    ) {
        this.gameStage = GameStage.WaitingForPlayers;
        this.cards = cards;
        this.roundTime = roundTime;
        this.timeCreated = new Date();
        this.players.set(firstPlayerId, new Player(firstPlayerName));
        this.adminId = firstPlayerId;
        this.subject = new Subject();
    }

    getGameStateObservable(): Observable<TGameStateObject> {
        const gameStateObject = this.toObject();
        return of(gameStateObject).pipe(concatWith(this.subject));
    }

    addPlayer(id: string, playerName: string): void {
        if (this.players.has(id)) {
            throw new Error('Client already in this game');
        }
        this.players.set(id, new Player(playerName));
        if (this.gameStage === GameStage.WaitingForPlayers) {
            this.setGameStage(GameStage.WaitingForStart);
        }
        this.pushState();
    }

    removePlayer(id: string): void {
        if (this.players.has(id)) {
            this.players.delete(id);
            this.pushState();
            if (this.players.size === 0) {
                this.subject.complete();
            }
        }
    }

    hasPlayers(): boolean {
        return this.players.size > 0;
    }

    hasPlayer(playerId: string): boolean {
        return this.players.has(playerId);
    }

    getAdmin(): string {
        return this.adminId;
    }

    selectPlayerCard(playerId: string, index: number): void {
        if (this.gameStage === GameStage.RoundInProgress) {
            this.players.get(playerId).setSelectedCard(index);
            this.pushState();
        }
    }

    resetRound(): void {
        if (
            this.gameStage === GameStage.WaitingForStart ||
            this.gameStage === GameStage.RoundFinished
        ) {
            for (const [, player] of this.players) {
                player.setSelectedCard(null);
            }
            this.gameStats = null;
            this.setGameStage(GameStage.RoundInProgress);
            this.pushState();
            this.startTimer();
        }
    }

    toObject(): TGameStateObject {
        const isRoundFinished = this.gameStage === GameStage.RoundFinished;
        return {
            gameStage: this.gameStage,
            cards: this.cards,
            gameStats: this.gameStats,
            adminId: this.adminId,
            currentTimeLeft: this.currentTimeLeft,
            timeCreated: this.timeCreated.toISOString(),
            players: Array.from(this.players).reduce((obj, [key, player]) => {
                obj[key] = player.toObject(isRoundFinished);
                return obj;
            }, {} as { [key: string]: TPlayerObject }),
        };
    }

    private setGameStage(newGameStage: GameStage) {
        const transitionTable = {
            [GameStage.WaitingForPlayers]: [GameStage.WaitingForStart],
            [GameStage.WaitingForStart]: [GameStage.RoundInProgress],
            [GameStage.RoundInProgress]: [GameStage.RoundInProgress, GameStage.RoundFinished],
            [GameStage.RoundFinished]: [GameStage.RoundInProgress],
        };

        if (transitionTable[this.gameStage].includes(newGameStage)) {
            this.gameStage = newGameStage;
        } else {
            console.warn(
                'warning: tried to change gameStage from',
                this.gameStage,
                'to',
                newGameStage,
                ',but this transition is not allowed.',
            );
        }
    }

    private pushState() {
        const gameStateObject = this.toObject();
        this.subject.next(gameStateObject);
    }

    private startTimer() {
        const INTERVAL = 1000;
        const timer$ = interval(INTERVAL).pipe(
            take(this.roundTime + 1),
            map((interval) => {
                const secondsLeft = this.roundTime - interval;
                this.currentTimeLeft = secondsLeft;
                return this.toObject();
            }),
            finalize(() => {
                console.log('timer ended');
                this.currentTimeLeft = null;
                this.finishRound();
            }),
        );

        timer$.subscribe((newState) => this.subject.next(newState));
    }

    private finishRound() {
        this.gameStage = GameStage.RoundFinished;
        this.calculateGameStats();
        this.pushState();
    }

    private calculateGameStats(): void {
        const selectedCards = Array.from(this.players.values()).map(
            (player) => this.cards[player.getSelectedCard()],
        );

        const [numerics, others] = this.splitCards(selectedCards);

        const gameStats: TGameStats = {
            average: this.calculateAverage(numerics),
            median: this.calculateMedian(numerics),
            others: this.countStrings(others),
        };

        this.gameStats = gameStats;
    }

    private calculateAverage(cards: number[]): number {
        const sum = cards.reduce((prev, curr) => (prev += curr), 0);
        return sum / cards.length;
    }

    private calculateMedian(cards: number[]): number {
        if (cards.length % 2 === 1) {
            return cards[Math.trunc(cards.length / 2)];
        } else {
            return (cards[cards.length / 2] + cards[cards.length / 2 - 1]) / 2;
        }
    }

    private countStrings(strings: string[]): { key: string; count: number }[] {
        const map: { key: string; count: number }[] = [];

        const uniqueStrings = [...new Set(strings)];
        uniqueStrings.forEach((key) => {
            map.push({
                key: key,
                count: strings.filter((string) => string === key).length,
            });
        });

        return map;
    }

    private splitCards(cards: string[]): [numerics: number[], others: string[]] {
        const numerics: number[] = [];
        const others: string[] = [];
        cards.forEach((cardValue) => {
            if (!isNaN(parseFloat(cardValue))) {
                numerics.push(parseFloat(cardValue));
            } else {
                others.push(cardValue);
            }
        });
        return [numerics, others];
    }
}
