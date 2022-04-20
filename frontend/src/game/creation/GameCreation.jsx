import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CardEditor from "./CardEditor";
import "./GameCreation.css";

function GameCreation(props) {
	const navigate = useNavigate();

	const [playerName, setPlayerName, socket] = useOutletContext();

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

	const createGame = () => {
		socket.emit("create-game", cards, playerName);
		socket.on("game-created", (sessionId) => {
			navigate(sessionId);
		});
	};

	return (
		<div className="game-creation">
			<div className="game-creation-player">
				<h1>Your Name:</h1>
				<input
					type="text"
					name="name"
					value={playerName}
					onChange={(event) => setPlayerName(event.target.value)}
				/>
			</div>
			<div className="game-creation-cards">
				<h1>Cards:</h1>
				<CardEditor cards={cards} setCards={setCards} />
			</div>
			<div className="game-creation-button">
				<button className="create-button" onClick={createGame}>
					Create
				</button>
			</div>
		</div>
	);
}

export default GameCreation;
