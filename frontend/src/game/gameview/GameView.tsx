import "./GameView.css";
import CardSelection from "./components/CardSelection";
import GameStats from "./components/GameStats";
import AllPlayers from "./components/AllPlayers";
import SessionInfo from "./components/SessionInfo";
import GameTimer from "./components/GameTimer";
import { GameStage } from "../../common/types/GameStage";
import { TGameStateObject } from "../../common/types/TGameStateObject";
import AdminButtons from "./components/AdminButtons";
import { useEffect, useState } from "react";

type GameViewArgs = {
	sessionId: string;
	gameState: TGameStateObject;
	ownId: string;
	selectCard: (index: number) => void;
	startSession: () => void;
	startNextRound: () => void;
};

function GameView({
	sessionId,
	gameState,
	ownId,
	selectCard,
	startSession,
	startNextRound,
}: GameViewArgs) {
	const [selectedCard, setSelectedCard] = useState(null);

	useEffect(() => {
		if (gameState.gameStage === GameStage.RoundInProgress) {
			setSelectedCard(null);
		}
	}, [gameState.gameStage]);

	const isAdmin = ownId === gameState.adminId;
	const isWaitingForPlayers =
		gameState.gameStage === GameStage.WaitingForPlayers;

	const gameViewClasses = ["game-view"];

	if (isWaitingForPlayers) {
		gameViewClasses.push("waiting");
	}

	const selectFunction = (index) => {
		setSelectedCard(index);
		selectCard(index);
	};

	return (
		<div className={gameViewClasses.join(" ")}>
			<div className="upper-section">
				<div className="main-board">
					<SessionInfo
						sessionId={sessionId}
						gameState={gameState}
					/>
					<AllPlayers
						gameStage={gameState.gameStage}
						cards={gameState.cards}
						players={gameState.players}
						ownId={ownId}
						ownSelectedCard={selectedCard}
					/>
				</div>
				<div className="game-control">
					<div className="stats-container">
						<GameTimer value={gameState.currentTimeLeft} />
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
					selectFunction={selectFunction}
				/>
			</div>
		</div>
	);
}

export default GameView;
