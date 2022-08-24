import { Link } from "react-router-dom";
import Footer from "../misc/Footer";
import "./StartPage.css";

function StartPage() {
	return (
		<div className="start-page">
			<div className="header">
				<h1>Planning Poker</h1>
				<div className="description">
					<p>
						Play the agile estimation game{" "}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://en.wikipedia.org/wiki/Planning_poker"
						>
							planning poker
						</a>
						!
					</p>
				</div>
			</div>
			<div className="main">
				<div className="join-session">
					<form>
						<label>
							<p>Game-ID:</p>
							<input type="text" />
						</label>
						<input className="button" type="submit" value="Join" />
					</form>
				</div>
				<div className="create-session">
					<Link className="button" to="/game">
						Create Session
					</Link>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default StartPage;
