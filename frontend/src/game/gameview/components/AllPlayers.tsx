import { GameStage } from "../../../common/types/GameStage";
import { TPlayerObject } from "../../../common/types/TPlayerObject";
import LoadingDots from "../../../misc/LoadingDots";
import "./AllPlayers.css";
import Player from "./Player";

type AllPlayersArgs = {
	gameStage: GameStage;
	cards: string[];
	players: { [id: string]: TPlayerObject };
	ownId: string;
	ownSelectedCard: number;
};

export default function AllPlayers({
	gameStage,
	cards,
	players,
	ownId,
	ownSelectedCard,
}: AllPlayersArgs) {
	const self = players[ownId];

	const others = Object.entries(players).filter(
		([id, player]) => id !== ownId
	);

	return (
		<div className="all-players">
			<Player
				key={ownId}
				gameStage={gameStage}
				self={true}
				name={self.name}
				cards={cards}
				selected={ownSelectedCard}
			/>
			{others.length > 0 ? (
				others.map(([id, player]) => {
					return (
						<Player
							key={id}
							gameStage={gameStage}
							name={player.name}
							cards={cards}
							selected={player.selectedCard}
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
