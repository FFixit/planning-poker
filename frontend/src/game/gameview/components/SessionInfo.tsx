import "./SessionInfo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

type SessionInfoArgs = {
	sessionId: string;
	timeCreated: string;
};

export default function SessionInfo({
	sessionId,
	timeCreated,
}: SessionInfoArgs) {
	const localizedTimeCreated = timeCreated
		? new Intl.DateTimeFormat([], {
				dateStyle: "medium",
				timeStyle: "medium",
		  }).format(new Date(timeCreated))
		: "";
	const copyToClipboard = () => {
		navigator.clipboard.writeText(sessionId);
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
			<div className="time-created-container">
				<p>
					Game open since:{" "}
					<span className="time-created">{localizedTimeCreated}</span>
				</p>
			</div>
		</div>
	);
}
