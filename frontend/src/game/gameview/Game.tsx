import React, { useState } from "react";
import "./Game.css";
import { useGameContext } from "./GameMain";
import GameView from "./GameView";
import PlayerCreation from "./PlayerCreation";

function Game() {
	const [playerName, setPlayerName, socket] = useGameContext();

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
