import Player from "./Player";

class GameState {
  private players: Map<string, Player> = new Map();
  private cards: Array<string> = [];
  private timeCreated: Date;
  private isRoundFinished: boolean = false;
  private gameStats = null;

  constructor(cards) {
    this.cards = cards;
    this.timeCreated = new Date();
  }

  addPlayer(id: string, player: Player): void {
    this.players.set(id, player);
  }

  removePlayer(id: string): void {
    this.players.delete(id);
    this.updateIsRoundFinished();
  }

  selectPlayerCard(id: string, index: number): void {
    this.players.get(id).setSelectedCard(index);
    this.updateIsRoundFinished();
  }

  getTimeCreated(): Date {
    return this.timeCreated;
  }

  toObject(as: string): object {
    return {
      cards: this.cards,
      selectedCard: this.players.get(as).getSelectedCard(),
      isRoundFinished: this.isRoundFinished,
      gameStats: this.gameStats,
      players: Array.from(this.players.keys())
        .filter((key) => key != as)
        .map((key) => this.players.get(key).toObject()),
    };
  }

  private updateIsRoundFinished(): void {
    this.isRoundFinished = Array.from(this.players.values()).every(
      (player) => typeof player.getSelectedCard() === "number"
    );
    if (this.isRoundFinished) {
      this.calculateGameStats();
    }
  }

  private calculateGameStats(): void {
    const selectedCards = Array.from(this.players.values()).map(
      (player) => this.cards[player.getSelectedCard()]
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
    let map = [];

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
    let numerics = [];
    let others = [];
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
