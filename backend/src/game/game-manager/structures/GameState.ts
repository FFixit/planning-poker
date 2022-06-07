import { GameStage } from '../../../common/types/GameStage';
import { TGameStateObject } from '../../../common/types/TGameStateObject';
import { concatWith, interval, Observable, of, Subject } from 'rxjs';
import { take, map, finalize } from 'rxjs/operators';
import Player from './Player';

export default class GameState {
    private gameStage: GameStage;
    private players: Map<string, Player> = new Map();
    private adminId: string;
    private cards: Array<string> = [];
    private timeCreated: Date;
    private gameStats = null;
    private subject: Subject<TGameStateObject>;
    private currentTimeLeft: number = null;

    constructor(cards: string[], firstPlayerId: string, firstPlayerName: string) {
        this.gameStage = GameStage.WaitingForPlayers;
        this.cards = cards;
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
            this.gameStage = GameStage.WaitingForStart;
        }
        this.pushState();
    }

    removePlayer(id: string): void {
        this.players.delete(id);
        this.pushState();
    }

    hasPlayers(): boolean {
        return this.players.size > 0;
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
            this.gameStage = GameStage.RoundInProgress;
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
            }, {}),
        };
    }

    private pushState() {
        const gameStateObject = this.toObject();
        this.subject.next(gameStateObject);
    }

    private startTimer() {
        const INTERVAL = 1000;
        const LENGTH = 10;
        const timer$ = interval(INTERVAL).pipe(
            take(LENGTH + 1),
            map((interval) => {
                const secondsLeft = LENGTH - interval;
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

        this.gameStats = {
            average: this.calculateAverage(numerics),
            median: this.calculateMedian(numerics),
            others: this.countStrings(others),
        };
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
        const map = [];

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
        const numerics = [];
        const others = [];
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
