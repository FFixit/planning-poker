import "./SessionInfo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { TGameStateObject } from "../../../common/types/TGameStateObject";
import { GameStage } from "../../../common/types/GameStage";

type SessionInfoArgs = {
	sessionId: string;
	gameState: TGameStateObject;
};

export default function SessionInfo({ sessionId, gameState }: SessionInfoArgs) {
	const localizedTimeCreated = gameState.timeCreated
		? new Intl.DateTimeFormat([], {
				dateStyle: "short",
				timeStyle: "short",
		  }).format(new Date(gameState.timeCreated))
		: "";
	const copyToClipboard = () => {
		navigator.clipboard.writeText(sessionId);
	};

	const statusMap = {
		[GameStage.WaitingForPlayers]: "Waiting for Players",
		[GameStage.WaitingForStart]: "Waiting for Start",
		[GameStage.RoundInProgress]: "Round in progress",
		[GameStage.RoundFinished]: "End of Round",
	};

	return (
		<div className="session-info">
			<div className="session-id-container">
				<p>
					Session ID:{" "}
					<span className="session-id" onClick={copyToClipboard}>
						{sessionId}
						<button className="copy-button">
							<FontAwesomeIcon icon={faCopy} />
						</button>
					</span>
				</p>
			</div>
			<div className="game-stage-container">
				<p>
					Status:{" "}
					<span className="game-stage">
						{statusMap[gameState.gameStage]}
					</span>
				</p>
			</div>
			<div className="time-created-container">
				<p>
					Game open since:{" "}
					<span className="time-created">{localizedTimeCreated}</span>
				</p>
			</div>
		</div>
	);
}
