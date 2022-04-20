import { Outlet } from "react-router-dom";
import "./GameMain.css";
import socketio from "socket.io-client";
import { useEffect, useRef, useState } from "react";

function GameMain() {
	const refSocket = useRef(null);

	const [playerName, setPlayerName] = useState("");

	useEffect(() => {
		refSocket.current = socketio("/");
		console.log("effect triggered in 'Game'");
		return () => refSocket.current.disconnect();
	}, [refSocket]);

	return <Outlet context={[playerName, setPlayerName, refSocket.current]} />;
}

export default GameMain;
