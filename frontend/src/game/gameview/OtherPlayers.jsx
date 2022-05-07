import "./OtherPlayers.css";
import Player from "./Player";

function OtherPlayers(props) {
	return (
		<div className="other-players">
			{props.players.map(([id, player]) => (
				<Player
					key={id}
					name={player.name}
					value={player.selectedCard}
				></Player>
			))}
		</div>
	);
}

export default OtherPlayers;
