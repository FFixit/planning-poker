import "./GameView.css";
import CardSelection from "./components/CardSelection";
import GameStats from "./components/GameStats";
import AllPlayers from "./components/AllPlayers";
import SessionInfo from "./components/SessionInfo";
import GameTimer from "./components/GameTimer";
import { GameStage } from "../../common/types/GameStage";
import { TGameStateObject } from "../../common/types/TGameStateObject";
import AdminButtons from "./components/AdminButtons";

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
	const isAdmin = ownId === gameState.adminId;
	const isWaitingForPlayers =
		gameState.gameStage === GameStage.WaitingForPlayers;
	const ownSelectedCard = gameState.players[ownId]?.selectedCard;
	const ownSelctedIndex =
		typeof ownSelectedCard === "number" ? ownSelectedCard : null;

	const gameViewClasses = ["game-view"];

	if (isWaitingForPlayers) {
		gameViewClasses.push("waiting");
	}

	return (
		<div className={gameViewClasses.join(" ")}>
			<div className="upper-section">
				<AllPlayers
					gameStage={gameState.gameStage}
					cards={gameState.cards}
					players={gameState.players}
					ownId={ownId}
				/>
				<div className="game-control">
					<div className="stats-container">
						<SessionInfo sessionId={sessionId} />
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
					selectedIndex={ownSelctedIndex}
					selectFunction={selectCard}
				/>
			</div>
		</div>
	);
}

export default GameView;
