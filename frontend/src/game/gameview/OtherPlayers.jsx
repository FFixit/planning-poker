import LoadingDots from "../../misc/LoadingDots";
import "./OtherPlayers.css";
import Player from "./Player";

function OtherPlayers({ players }) {
	return (
		<div className="other-players">
			{players.length > 0 ? (
				players.map(([id, player]) => (
					<Player
						key={id}
						name={player.name}
						value={player.selectedCard}
					></Player>
				))
			) : (
				<div className="waiting-for-players">
					<p>Waiting for players</p>
					<LoadingDots />
				</div>
			)}
		</div>
	);
}

export default OtherPlayers;
