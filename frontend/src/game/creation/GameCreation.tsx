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
	const [playerName, setPlayerName] = useState("Player");
	const [isPlayerNameValid, setPlayerNameValid] = useState(true);
	const [roundTime, setRoundTime] = useState(10);
	const [isRoundTimeValid, setRoundTimeValid] = useState(true);

	const checkPlayerName: React.FormEventHandler<HTMLInputElement> = (
		event
	) => {
		const target = event.target as HTMLInputElement;
		const currentValue = target.value;
		if (currentValue.length < 3) {
			setPlayerNameValid(false);
			target.setCustomValidity("Name must be at least 3 characters long");
		} else if (currentValue.length > 15) {
			setPlayerNameValid(false);
			target.setCustomValidity(
				"Name cannot be longer than 15 characters"
			);
			target.reportValidity();
		} else {
			setPlayerNameValid(true);
			target.setCustomValidity("");
		}
		target.checkValidity();
	};
	const checkRoundTime: React.FormEventHandler<HTMLInputElement> = (
		event
	) => {
		const target = event.target as HTMLInputElement;
		const currentValue = parseInt(target.value);
		if (currentValue < 1) {
			setRoundTimeValid(false);
			target.setCustomValidity(
				"Round time must be greater than 1 seconds"
			);
		} else if (currentValue > 60) {
			setRoundTimeValid(false);
			target.setCustomValidity(
				"Round time cannot be longer than 60 seconds"
			);
			target.reportValidity();
		} else {
			setRoundTimeValid(true);
			target.setCustomValidity("");
		}
		target.checkValidity();
	};

	const validate = () => {
		const isValid = isPlayerNameValid && isRoundTimeValid;
		console.log("isValid", isValid);
		return isValid;
	};

	const createGame = () => {
		socket.emit(
			"create-game",
			{ cards, roundTime, playerName },
			(sessionId: string) => {
				navigate(sessionId);
			}
		);
	};

	return (
		<div className="game-creation">
			<div className="heading">
				<h1>Create a session</h1>
			</div>
			<div className="settings">
				<div className="left-section">
					<div className="game-creation-cards">
						<h2>Cards:</h2>
						<CardEditor cards={cards} setCards={setCards} />
					</div>
				</div>
				<div className="right-section">
					<div className="game-creation-settings">
						<div className="game-creation-player">
							<h2>Your Name:</h2>
							<input
								id="player-name-input"
								type="text"
								value={playerName}
								onInput={checkPlayerName}
								onChange={(event) =>
									setPlayerName(event.target.value)
								}
							/>
						</div>
						<div className="game-creation-round-time">
							<h2>Round duration (sec.):</h2>
							<input
								id="round-time-input"
								type="number"
								min={1}
								max={60}
								step={1}
								value={roundTime}
								onInput={checkRoundTime}
								onChange={(event) =>
									setRoundTime(parseInt(event.target.value))
								}
							/>
						</div>
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
		</div>
	);
}

export default GameCreation;
