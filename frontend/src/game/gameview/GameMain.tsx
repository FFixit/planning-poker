import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import "./GameMain.css";
import socketio, { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

type ContextType = [string, (string) => void, Socket];

function GameMain() {
	const navigate = useNavigate();
	const refNavigate = useRef(navigate);
	const refSocket = useRef(null);

	const [playerName, setPlayerName] = useState("");

	useEffect(() => {
		const socket = socketio("/", { autoConnect: false });
		socket.connect();

		socket.on("disconnect", () => {
			console.error("Socket disconnected");
			refNavigate.current("/");
		});

		refSocket.current = socket;
		return () => {
			socket.disconnect();
		};
	}, [refSocket, refNavigate]);

	return <Outlet context={[playerName, setPlayerName, refSocket.current]} />;
}

export default GameMain;

export function useGameContext() {
	return useOutletContext<ContextType>();
}
