import "./CardSelection.css";
import { GameStage } from "../../../common/types/GameStage";
import Card from "./Card";

type CardSelectionArgs = {
	gameStage: GameStage;
	cards: string[];
	selectedIndex: number;
	selectFunction: (index: number) => void;
};

function CardSelection({
	gameStage,
	cards,
	selectedIndex,
	selectFunction,
}: CardSelectionArgs) {
	const areCardsActive = gameStage === GameStage.RoundInProgress;
	return (
		<div className="card-selection">
			{cards.map((value, i) => (
				<Card
					key={i}
					active={areCardsActive}
					value={value}
					index={i}
					selected={i === selectedIndex}
					onClick={selectFunction}
				/>
			))}
		</div>
	);
}

export default CardSelection;
