import "./Player.css";

function Player(props) {
	let hasValue = !!props.value;
	let displayValue = hasValue ? props.value : "?";
	let className = "player-card" + (hasValue ? "" : " no-value");
	return (
		<div className="player">
			<div className={className}>
				<p>{displayValue}</p>
			</div>
			<div className="player-name">
				<p>{props.name}</p>
			</div>
		</div>
	);
}

export default Player;
