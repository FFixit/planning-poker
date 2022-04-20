import Player from "./Player";

class GameState {
  private players: Map<string, Player> = new Map();
  private cards: Array<string> = [];
  private timeCreated: Date;
  private isRoundFinished: boolean = false;

  constructor(cards) {
    this.cards = cards;
    this.timeCreated = new Date();
  }

  private updateIsRoundFinished() {
    this.isRoundFinished = Array.from(this.players.values()).every(
      (player) => typeof player.getSelectedCard() === "number"
    );
  }

  addPlayer(id: string, player: Player): void {
    this.players.set(id, player);
  }

  removePlayer(id: string): void {
    this.players.delete(id);
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
      players: Array.from(this.players.keys())
        .filter((key) => key != as)
        .map((key) => this.players.get(key).toObject()),
    };
  }
}

export default GameState;
