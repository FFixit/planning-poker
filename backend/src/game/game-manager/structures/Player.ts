import { TPlayerObject } from '../../../common/types/TPlayerObject';

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

    toObject(isRoundFinished: boolean): TPlayerObject {
        return {
            name: this.name,
            selectedCard: this.getMaskedCardValue(isRoundFinished),
        };
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
}

export default Player;
