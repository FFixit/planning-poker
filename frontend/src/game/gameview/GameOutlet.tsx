import "./GameOutlet.css";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import socketio, { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import LoadingDots from "../../misc/LoadingDots";

function GameOutlet() {
	const navigate = useNavigate();
	const refNavigate = useRef(navigate);
	const refSocket = useRef<Socket>(null);

	const [isConnected, setConnected]: [boolean, Function] = useState(false);

	useEffect(() => {
		console.log("GameOutlet Effect: Socket connect");
		const socket = socketio("/", { autoConnect: false });
		socket.connect();

		socket.onAny((event, data) => {
			console.log("+++ Recieved WebSocket Event", event, data);
		});
		socket.onAnyOutgoing((event, data) => {
			console.log("+++ Sending WebSocket Event", event, data);
		});

		socket.on("exception", (data) => {
			console.log("!EXCEPTION", data);
		});

		socket.on("disconnect", () => {
			console.error("Socket disconnected");
			refNavigate.current("/");
		});

		refSocket.current = socket;
		setConnected(true);
		return () => {
			console.log("GameOutlet Effect: Socket disconnect");
			socket.disconnect();
		};
	}, [refSocket, refNavigate]);

	if (isConnected) {
		return <Outlet context={[refSocket]} />;
	} else {
		return <LoadingDots />;
	}
}

export default GameOutlet;

type ContextType = [React.MutableRefObject<Socket>];

export function useGameContext() {
	return useOutletContext<ContextType>();
}
