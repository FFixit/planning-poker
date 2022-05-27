class Player {
    private name: string;
    private selectedCard: number;

    constructor(name) {
        this.name = name;
        this.selectedCard = null;
    }

    setSelectedCard(index: number): void {
        this.selectedCard = index;
    }

    getSelectedCard(): number {
        return this.selectedCard;
    }

    private getMaskedCardValue(isGameFinished: boolean): number | true {
        if (isGameFinished) {
            return this.selectedCard;
        } else {
            if (this.selectedCard) {
                return true;
            } else {
                return;
            }
        }
    }

    toObject(isGameFinished: boolean): {
        name: string;
        selectedCard: number | true;
    } {
        return {
            name: this.name,
            selectedCard: this.getMaskedCardValue(isGameFinished),
        };
    }
}

export default Player;
