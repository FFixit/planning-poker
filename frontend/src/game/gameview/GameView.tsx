import "./GameView.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardSelection from "./components/CardSelection";
import GameStats from "./components/GameStats";
import OtherPlayers from "./components/OtherPlayers";
import SessionInfo from "./components/SessionInfo";
import { useGameContext } from "./GameOutlet";
import PlayerCreation from "./PlayerCreation";

function GameView() {
	const params = useParams();
	const sessionId = params.sessionId;

	const [socketRef, gameState] = useGameContext();
	const [isJoined, setJoined] = useState(
		socketRef.current && socketRef.current.id in gameState.players
	);
	const [selectedCard, setSelectedCard] = useState(null);

	useEffect(() => {
		const socket = socketRef.current;
		return () => {
			if (isJoined) {
				socket.emit("leave-game", { sessionId });
			}
		};
	}, [socketRef, sessionId, isJoined]);

	useEffect(() => {
		const socket = socketRef.current;
		if (socket) {
			const ownSelectedCard =
				gameState.players[socket.id] &&
				gameState.players[socket.id].selectedCard;
			if (typeof ownSelectedCard === "undefined") {
				setSelectedCard(ownSelectedCard);
			}
		}
	}, [socketRef, gameState]);

	const players = Object.entries(gameState.players).filter(
		([id, player]) => id !== socketRef.current.id
	);

	const createPlayer = (playerName: string) => {
		socketRef.current.emit("join-game", { sessionId, playerName });
		setJoined(true);
	};

	const selectCard = (index: number) => {
		if (!gameState.isRoundFinished) {
			setSelectedCard(index);
			socketRef.current.emit("select-card", { sessionId, index });
		}
	};

	const nextRound = () => {
		socketRef.current.emit("next-round", { sessionId });
	};

	const isAdmin = socketRef.current.id === gameState.adminId;

	return isJoined ? (
		<div className="game-view">
			<div className="upper-section">
				<OtherPlayers cards={gameState.cards} players={players} />
				<div className="game-control">
					<div className="stats-container">
						<SessionInfo sessionId={sessionId} />
						<GameStats gameStats={gameState.gameStats} />
					</div>
					{isAdmin && (
						<div className="admin-buttons">
							<button
								className="button button-next-round"
								onClick={nextRound}
							>
								Next round
							</button>
						</div>
					)}
				</div>
			</div>
			<CardSelection
				cards={gameState.cards}
				selectedIndex={selectedCard}
				selectFunction={selectCard}
			/>
		</div>
	) : (
		<PlayerCreation onPlayerCreation={createPlayer} />
	);
}

export default GameView;
