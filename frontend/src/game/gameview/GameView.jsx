import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./GameView.css";
import CardSelection from "./CardSelection";
import OtherPlayers from "./OtherPlayers";
import GameStats from "./GameStats";

function GameView({ socket, playerName, setPlayerName }) {
	const params = useParams();
	const sessionId = params.sessionId;

	const [gameState, setGameState] = useState({
		cards: [],
		players: [],
	});

	const [selectedCard, setSelectedCard] = useState(null);

	useEffect(() => {
		console.log("effect triggered in 'GameView'");
		socket.emit("join-game", sessionId, playerName);

		socket.on("update-state", (newState) => {
			console.log("game state updating", newState);
			setGameState(newState);
		});

		return () => {
			setPlayerName("");
			socket.emit("leave-game", sessionId);
		};
	}, [sessionId, playerName, socket, setPlayerName]);

	const selectCard = (index) => {
		setSelectedCard(index);
		socket.emit("select-card", sessionId, index);
	};

	return (
		<div className="game-view">
			<div className="upper-section">
				<OtherPlayers
					players={gameState.players.map((player) => {
						return {
							name: player.name,
							value:
								player.selectedCard != null
									? gameState.cards[player.selectedCard]
									: null,
						};
					})}
				/>
				<GameStats state={gameState} />
			</div>
			<CardSelection
				cards={gameState.cards}
				selectedIndex={selectedCard}
				selectFunction={selectCard}
			/>
		</div>
	);
}

export default GameView;
