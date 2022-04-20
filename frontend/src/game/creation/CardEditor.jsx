import "./CardEditor.css";
import EditableCard from "./EditableCard";

function CardEditor(props) {
	return (
		<div className="card-editor">
			{props.cards.map((card, i) => (
				<EditableCard
					key={i.toString()}
					value={card}
					onChange={(event) => {
						let newCards = props.cards.slice();
						let newValue = isNaN(parseInt(event.target.value))
							? event.target.value
							: parseInt(event.target.value).toString();

						newCards[i] = newValue;
						props.setCards(newCards);
					}}
					onRemove={(event) => {
						let newCards = props.cards.slice();
						newCards.splice(i, 1);
						props.setCards(newCards);
					}}
				/>
			))}
			<button
				className="add-card"
				onClick={() => {
					let newCards = props.cards.slice();
					newCards.push("");
					props.setCards(newCards);
				}}
			>
				<p>+</p>
			</button>
		</div>
	);
}

export default CardEditor;
