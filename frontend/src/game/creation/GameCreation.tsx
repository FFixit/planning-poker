import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../gameview/components/SocketProvider";
import CardEditor from "./CardEditor";
import "./GameCreation.css";

function GameCreation() {
	const navigate = useNavigate();

	const socket = useSocket();

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

	const checkInputValidity: React.FormEventHandler<HTMLInputElement> = (
		event
	) => {
		const target = event.target as HTMLInputElement;
		const currentValue = target.value;
		if (currentValue.length < 3) {
			target.setCustomValidity("Name must be at least 3 characters long");
		} else if (currentValue.length > 15) {
			target.setCustomValidity(
				"Name cannot be longer than 15 characters"
			);
			target.reportValidity();
		} else {
			target.setCustomValidity("");
		}
		target.checkValidity();
	};

	const validate = () => {
		const playerNameInput =
			document.querySelector<HTMLInputElement>("#player-name-input");
		const isValid =
			cards.length > 0 &&
			typeof playerName === "string" &&
			playerName !== "" &&
			playerNameInput?.checkValidity();
		return isValid;
	};

	const createGame = () => {
		socket.emit(
			"create-game",
			{ cards, playerName },
			(sessionId: string) => {
				navigate(sessionId);
			}
		);
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
						id="player-name-input"
						type="text"
						name="name"
						value={playerName}
						onInput={checkInputValidity}
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
