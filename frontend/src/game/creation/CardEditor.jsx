import "./CardEditor.css";
import EditableCard from "./EditableCard";

function CardEditor({ cards, setCards }) {
	const onChangeCard = (index, newValue) => {
		let newCards = cards.slice();
		newCards[index] = newValue;
		setCards(newCards);
	};

	const onRemoveCard = (index) => {
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
