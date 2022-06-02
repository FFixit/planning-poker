import "./AdminButtons.css";
import { GameStage } from "../../../common/types/GameStage";

type AdminButtonsProps = {
	gameStage: GameStage;
	startSession: () => void;
	startNextRound: () => void;
};

export default function AdminButtons({
	gameStage,
	startSession,
	startNextRound,
}: AdminButtonsProps) {
	const showButtonStartSession = gameStage === GameStage.WaitingForStart;
	const showButtonNextRound = gameStage === GameStage.RoundFinished;
	return (
		<div className="admin-buttons">
			{showButtonStartSession && (
				<button className="button" onClick={startSession}>
					Start Session
				</button>
			)}
			{showButtonNextRound && (
				<button className="button" onClick={startNextRound}>
					Next round
				</button>
			)}
		</div>
	);
}
