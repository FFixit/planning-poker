import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketio, { Socket } from "socket.io-client";
import LoadingSpinner from "../../../misc/LoadingSpinner";
import { useError } from "../error/ErrorProvider";

const SocketContext = React.createContext<Socket | undefined>(undefined);

type SocketProviderArgs = {};

export function SocketProvider(
	props: React.PropsWithChildren<SocketProviderArgs>
) {
	const refSocket = useRef<Socket | undefined>(undefined);
	const navigate = useNavigate();
	const [setError] = useError();
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		let socket: Socket;
		if (!refSocket.current) {
			console.log("GameOutlet Effect: Socket connect");
			socket = socketio("/", { autoConnect: false });
			socket.connect();

			socket.onAny((event, data) => {
				console.log("+++ Recieved WebSocket Event", event, data);
			});
			socket.onAnyOutgoing((event, data) => {
				console.log("+++ Sending WebSocket Event", event, data);
			});

			socket.on("exception", (data) => {
				console.log("!EXCEPTION", data);
				socket.disconnect();
				setError(data.message || data);
			});

			socket.on("disconnect", () => {
				console.error("Socket disconnected");
			});

			refSocket.current = socket;
			setConnected(true);
		}
	}, [connected, navigate, setError]);

	return (
		<SocketContext.Provider value={refSocket.current}>
			{connected ? props.children : <LoadingSpinner />}
		</SocketContext.Provider>
	);
}

export function useSocket() {
	const context = React.useContext(SocketContext);
	if (context === undefined) {
		throw new Error(
			"useSocket cannot be used outside of an SocketProvider"
		);
	}

	return context;
}
