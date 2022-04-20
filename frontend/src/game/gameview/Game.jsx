import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./Game.css";
import GameView from "./GameView";
import PlayerCreation from "./PlayerCreation";

function Game(props) {
	const [playerName, setPlayerName, socket] = useOutletContext();

	const [isPlayerCreationDone, setPlayerCreationDone] = useState(
		playerName !== ""
	);

	const createPlayer = (playerName) => {
		setPlayerName(playerName);
		setPlayerCreationDone(true);
	};

	return isPlayerCreationDone ? (
		<GameView
			socket={socket}
			playerName={playerName}
			setPlayerName={setPlayerName}
		/>
	) : (
		<PlayerCreation onPlayerCreation={createPlayer} />
	);
}

export default Game;
