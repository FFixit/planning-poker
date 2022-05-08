import "./SessionInfo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

function SessionInfo({ sessionId }) {
	const copyToClipboard = () => {
		navigator.clipboard.writeText(sessionId);
	};

	return (
		<div className="session-info">
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
	);
}

export default SessionInfo;
