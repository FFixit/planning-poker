import Player from './Player';

class GameState {
    private players: Map<string, Player> = new Map();
    private adminId: string;
    private cards: Array<string> = [];
    private timeCreated: Date;
    private isRoundFinished = false;
    private gameStats = null;

    constructor(cards: string[], firstPlayerId: string, firstPlayerName: string) {
        this.cards = cards;
        this.timeCreated = new Date();
        this.addPlayer(firstPlayerId, firstPlayerName);
        this.setAdmin(firstPlayerId);
    }

    addPlayer(id: string, playerName: string): void {
        if (this.players.has(id)) {
            throw new Error('Client already in this game');
        }
        this.players.set(id, new Player(playerName));
    }

    removePlayer(id: string): void {
        this.players.delete(id);
        this.updateIsRoundFinished();
    }

    setAdmin(playerId: string): void {
        this.adminId = playerId;
    }

    getAdmin(): string {
        return this.adminId;
    }

    selectPlayerCard(playerId: string, index: number): void {
        this.players.get(playerId).setSelectedCard(index);
        this.updateIsRoundFinished();
    }

    resetRound(): void {
        for (const [, player] of this.players) {
            player.setSelectedCard(null);
        }
        this.gameStats = null;
        this.isRoundFinished = false;
    }

    getTimeCreated(): Date {
        return this.timeCreated;
    }

    toObject(): {
        cards: string[];
        isRoundFinished: boolean;
        gameStats: any;
        adminId: string;
        players: { [x: string]: ReturnType<Player['toObject']> };
    } {
        return {
            cards: this.cards,
            isRoundFinished: this.isRoundFinished,
            gameStats: this.gameStats,
            adminId: this.adminId,
            players: Array.from(this.players).reduce((obj, [key, player]) => {
                obj[key] = player.toObject(this.isRoundFinished);
                return obj;
            }, {}),
        };
    }

    private updateIsRoundFinished(): void {
        this.isRoundFinished = Array.from(this.players.values()).every(
            (player) => typeof player.getSelectedCard() === 'number',
        );
        if (this.isRoundFinished) {
            this.calculateGameStats();
        }
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

export default GameState;
