import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../gameview/GameOutlet";
import CardEditor from "./CardEditor";
import "./GameCreation.css";

function GameCreation() {
	const navigate = useNavigate();

	const [socketRef] = useGameContext();
	const socket = socketRef.current;

	const [cards, setCards] = useState([
		"0",
		"1",
		"2",
		"3",
		"5",
		"8",
		"13",
		"20",
		"40",
		"100",
		"?",
		"☕",
	]);
	const [playerName, setPlayerName] = useState("");

	const validate = () => {
		const isValid =
			cards.length > 0 &&
			typeof playerName === "string" &&
			playerName !== "";
		return isValid;
	};

	const createGame = () => {
		socket.emit("create-game", { cards, playerName }, (sessionId) => {
			navigate(sessionId);
		});
	};

	return (
		<div className="game-creation">
			<div className="left-section">
				<div className="game-creation-cards">
					<h1>Cards:</h1>
					<CardEditor cards={cards} setCards={setCards} />
				</div>
			</div>
			<div className="right-section">
				<div className="game-creation-player">
					<h1>Your Name:</h1>
					<input
						type="text"
						name="name"
						value={playerName}
						onChange={(event) => setPlayerName(event.target.value)}
					/>
				</div>

				<div className="game-creation-button">
					<button
						className="button create-button"
						disabled={!validate()}
						onClick={createGame}
					>
						Create
					</button>
				</div>
			</div>
		</div>
	);
}

export default GameCreation;
