import Card from "./Card";
import "./CardSelection.css";

function CardSelection(props) {
	return (
		<div className="card-selection">
			{props.cards.map((value, i) => (
				<Card
					key={i}
					value={value}
					index={i}
					selected={i === props.selectedIndex}
					onClick={props.selectFunction}
				/>
			))}
		</div>
	);
}

export default CardSelection;
