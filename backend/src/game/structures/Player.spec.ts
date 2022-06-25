import { TPlayerObject } from 'src/common/types/TPlayerObject';
import Player from './Player';

describe('GameMangerLib', () => {
    let player: Player;

    const playerName = 'Player1';

    beforeEach(async () => {
        player = new Player(playerName);
    });

    describe('setSelectedCard', () => {
        const selectedIndex = 12;
        describe('when setSelectedCard is called', () => {
            beforeEach(() => {
                player.setSelectedCard(selectedIndex);
            });

            test('then it should set selectedCard', () => {
                expect(player['selectedCard']).toEqual(selectedIndex);
            });
        });
    });

    describe('getSelectedCard', () => {
        const selectedIndex = 12;

        beforeEach(() => {
            player['selectedCard'] = selectedIndex;
        });

        describe('when getSelectedCard is called', () => {
            let returnedIndex: number;
            beforeEach(() => {
                returnedIndex = player.getSelectedCard();
            });

            test('then it should return selectedCard', () => {
                expect(returnedIndex).toEqual(selectedIndex);
            });
        });
    });

    describe('toObject', () => {
        const selectedIndex = 12;

        beforeEach(() => {
            player['selectedCard'] = selectedIndex;
        });

        describe('when toObject is called with isRoundFinished=true', () => {
            const expectedObject = {
                name: 'Player1',
                selectedCard: 12,
            };

            let playerObject: TPlayerObject;
            beforeEach(() => {
                playerObject = player.toObject(true);
            });

            test('then it should return the expected object', () => {
                expect(playerObject).toEqual(expectedObject);
            });
        });

        describe('when toObject is called with isRoundFinished=false', () => {
            const expectedObject = {
                name: 'Player1',
                selectedCard: true,
            };

            let playerObject: TPlayerObject;
            beforeEach(() => {
                playerObject = player.toObject(false);
            });

            test('then it should return the expected object', () => {
                expect(playerObject).toEqual(expectedObject);
            });
        });
    });

    describe('getMaskedCardValue', () => {
        describe('when getMaskedCardValue is called with isGameFinished=true', () => {
            let returnedValue;
            const selectedCard = 12;
            beforeEach(() => {
                player['selectedCard'] = selectedCard;
                returnedValue = player['getMaskedCardValue'](true);
            });

            test('then it should return selectedCard', () => {
                expect(returnedValue).toEqual(selectedCard);
            });
        });
        describe('when getMaskedCardValue is called with isGameFinished=false, selectedCard!=undefined', () => {
            let returnedValue;
            const selectedCard = 12;
            beforeEach(() => {
                player['selectedCard'] = selectedCard;
                returnedValue = player['getMaskedCardValue'](false);
            });

            test('then it should return selectedCard', () => {
                expect(returnedValue).toEqual(true);
            });
        });
        describe('when getMaskedCardValue is called with isGameFinished=false, selectedCard=undefined', () => {
            let returnedValue;
            beforeEach(() => {
                returnedValue = player['getMaskedCardValue'](false);
            });

            test('then it should return selectedCard', () => {
                expect(returnedValue).toEqual(undefined);
            });
        });
    });
});
