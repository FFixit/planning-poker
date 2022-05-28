import LoadingDots from "../../../misc/LoadingDots";
import "./OtherPlayers.css";
import Player from "./Player";

function OtherPlayers({ cards, players }) {
	return (
		<div className="other-players">
			{players.length > 0 ? (
				players.map(([id, player]) => {
					const cardValue =
						typeof player.selectedCard === "number"
							? cards[player.selectedCard]
							: player.selectedCard;
					return (
						<Player
							key={id}
							name={player.name}
							value={cardValue}
						></Player>
					);
				})
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
