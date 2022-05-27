import "./Card.css";

function Card(props) {
	let className = "card player-card" + (props.selected ? " selected" : "");
	return (
		<div
			className={className}
			onClick={() => {
				props.onClick(props.index);
			}}
		>
			<p>{props.value}</p>
		</div>
	);
}

export default Card;
