import { Link } from "react-router-dom";
import "./StartPage.css";

function StartPage(props) {
	return (
		<div className="start-page">
			<h1>Planning Poker</h1>
			<div className="main">
				<div className="join-session">
					<form>
						<label>
							<p>Game-ID:</p>
							<input type="text" />
						</label>
						<input type="submit" value="Join" />
					</form>
				</div>
				<div className="create-session">
					<Link to="/game">Create Session</Link>
				</div>
			</div>
		</div>
	);
}

export default StartPage;
