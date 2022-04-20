class Player {
  private name: string;
  private selectedCard: number;

  constructor(name) {
    this.name = name;
  }

  setSelectedCard(index: number): void {
    this.selectedCard = index;
  }

  getSelectedCard(): number {
    return this.selectedCard;
  }

  toObject(): object {
    return {
      name: this.name,
      selectedCard: this.selectedCard,
    };
  }
}

export default Player;
