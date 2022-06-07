import "./GamePage.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerCreation from "./PlayerCreation";
import { GameStage } from "../../common/types/GameStage";
import { TGameStateObject } from "../../common/types/TGameStateObject";
import GameView from "./GameView";
import LoadingSpinner from "../../misc/LoadingSpinner";
import { useSocket } from "./components/SocketProvider";

function GamePage() {
	const params = useParams();
	const sessionId = params.sessionId;

	const socket = useSocket();

	const [gameState, setGameState]: [TGameStateObject, Function] = useState({
		gameStage: GameStage.WaitingForPlayers,
		cards: [],
		gameStats: null,
		adminId: null,
		currentTimeLeft: null,
		players: {},
	});
	const [isJoined, setJoined] = useState(false);
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		if (!isJoined) {
			socket.on("subscribe-game", (newState: TGameStateObject) => {
				console.log("recieved new game state", newState);
				console.log(newState.currentTimeLeft);
				setGameState(newState);
				setJoined(socket && socket.id in newState.players);
				setLoading(false);
			});
			socket.emit("subscribe-game", { sessionId });
		}

		return () => {
			if (isJoined) {
				socket.removeListener("subscribe-game");
				socket.emit("leave-game", { sessionId });
			}
		};
	}, [socket, sessionId, isJoined]);

	const createPlayer = (playerName: string) => {
		socket.emit("join-game", { sessionId, playerName }, () => {
			setJoined(true);
		});
	};

	const selectCard = (index: number) => {
		if (gameState.gameStage === GameStage.RoundInProgress) {
			socket.emit("select-card", { sessionId, index });
		}
	};

	const startSession = () => {
		socket.emit("next-round", { sessionId });
	};

	const startNextRound = () => {
		socket.emit("next-round", { sessionId });
	};

	if (isLoading) {
		return <LoadingSpinner />;
	} else {
		if (isJoined) {
			return (
				<GameView
					sessionId={sessionId}
					gameState={gameState}
					ownId={socket.id}
					selectCard={selectCard}
					startSession={startSession}
					startNextRound={startNextRound}
				/>
			);
		} else {
			return <PlayerCreation onPlayerCreation={createPlayer} />;
		}
	}
}

export default GamePage;
