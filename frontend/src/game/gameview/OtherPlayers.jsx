import "./OtherPlayers.css";
import Player from "./Player";

function OtherPlayers(props) {
	return (
		<div className="other-players">
			{props.players.map((player, i) => (
				<Player
					key={i}
					name={player.name}
					value={player.value}
				></Player>
			))}
		</div>
	);
}

export default OtherPlayers;
