import "./CardEditor.css";
import EditableCard from "./EditableCard";

function CardEditor({
	cards,
	setCards,
}: {
	cards: string[];
	setCards: (newCards: string[]) => void;
}) {
	const onChangeCard = (index: number, newValue: string) => {
		let newCards = cards.slice();
		newCards[index] = newValue;
		setCards(newCards);
	};

	const onRemoveCard = (index: number) => {
		let newCards = cards.slice();
		newCards.splice(index, 1);
		setCards(newCards);
	};

	const addCard = () => {
		let newCards = cards.slice();
		newCards.push("");
		setCards(newCards);
	};

	return (
		<div className="card-editor">
			{cards.map((card, i) => (
				<EditableCard
					key={i}
					index={i}
					value={card}
					onChange={onChangeCard}
					onRemove={onRemoveCard}
				/>
			))}
			<button className="add-card" onClick={addCard}>
				<p>+</p>
			</button>
		</div>
	);
}

export default CardEditor;
