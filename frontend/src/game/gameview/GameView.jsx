import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./GameView.css";
import CardSelection from "./CardSelection";
import OtherPlayers from "./OtherPlayers";
import GameStats from "./GameStats";
import SessionInfo from "./SessionInfo";

function GameView({ socket, playerName, setPlayerName }) {
	const params = useParams();
	const sessionId = params.sessionId;

	const [gameState, setGameState] = useState({
		cards: [],
		players: {},
		gameStats: null,
		isRoundFinished: false,
	});

	const [selectedCard, setSelectedCard] = useState(null);

	useEffect(() => {
		console.log("effect triggered in 'GameView'");
		socket.emit("join-game", sessionId, playerName);

		socket.on("update-state", (newState) => {
			console.log("game state updating", newState);
			setGameState(newState);
			if (
				typeof newState.players[socket.id].selectedCard === "undefined"
			) {
				setSelectedCard(null);
			}
		});

		return () => {
			setPlayerName("");
			socket.emit("leave-game", sessionId);
		};
	}, [sessionId, playerName, socket, setPlayerName]);

	const players = Object.entries(gameState.players).filter(
		([id, player]) => id !== socket.id
	);

	const selectCard = (index) => {
		setSelectedCard(index);
		socket.emit("select-card", sessionId, index);
	};

	const nextRound = () => {
		socket.emit("next-round", sessionId);
	};

	return (
		<div className="game-view">
			<div className="upper-section">
				<OtherPlayers players={players} />
				<div className="game-control">
					<SessionInfo sessionId={sessionId} />
					<GameStats gameStats={gameState.gameStats} />
					<div className="admin-buttons">
						<button
							className="button button-next-round"
							onClick={nextRound}
						>
							Next round
						</button>
					</div>
				</div>
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
