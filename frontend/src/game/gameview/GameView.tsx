import "./GameView.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardSelection from "./components/CardSelection";
import GameStats from "./components/GameStats";
import OtherPlayers from "./components/OtherPlayers";
import SessionInfo from "./components/SessionInfo";
import { useGameContext } from "./GameOutlet";
import PlayerCreation from "./PlayerCreation";
import GameTimer from "./components/GameTimer";
import { GameStage } from "../../common/types/GameStage";
import { TGameStateObject } from "../../common/types/TGameStateObject";
import AdminButtons from "./components/AdminButtons";

function GameView() {
	const params = useParams();
	const sessionId = params.sessionId;

	const [socketRef] = useGameContext();

	const [gameState, setGameState]: [TGameStateObject, Function] = useState({
		gameStage: GameStage.WaitingForPlayers,
		cards: [],
		isRoundFinished: false,
		gameStats: null,
		adminId: null,
		currentTimeLeft: null,
		players: {},
	});
	const [isJoined, setJoined] = useState(false);
	const [selectedCard, setSelectedCard] = useState(null);

	useEffect(() => {
		const socket = socketRef.current;

		if (!isJoined) {
			socket.on("subscribe-game", (newState: TGameStateObject) => {
				console.log("recieved new game state", newState);
				console.log(newState.currentTimeLeft);
				setGameState(newState);
				setJoined(
					socketRef.current &&
						socketRef.current.id in newState.players
				);
			});
			socket.emit("subscribe-game", { sessionId });
		}

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
		socketRef.current.emit("select-card", { sessionId, index });
	};

	const startSession = () => {
		socketRef.current.emit("next-round", { sessionId });
	};

	const startNextRound = () => {
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
						<GameTimer
							value={gameState.currentTimeLeft}
						></GameTimer>
						<GameStats gameStats={gameState.gameStats} />
					</div>
					{isAdmin && (
						<AdminButtons
							gameStage={gameState.gameStage}
							startNextRound={startNextRound}
							startSession={startSession}
						/>
					)}
				</div>
			</div>
			<div className="lower-section">
				<CardSelection
					gameStage={gameState.gameStage}
					cards={gameState.cards}
					selectedIndex={selectedCard}
					selectFunction={selectCard}
				/>
			</div>
		</div>
	) : (
		<PlayerCreation onPlayerCreation={createPlayer} />
	);
}

export default GameView;
