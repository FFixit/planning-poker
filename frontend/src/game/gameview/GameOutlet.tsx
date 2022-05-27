import "./GameOutlet.css";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import socketio, { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import LoadingDots from "../../misc/LoadingDots";

type GameStateType = {
	cards: string[];
	isRoundFinished: boolean;
	gameStats: any;
	players: { [x: string]: { name: string; selectedCard: number | true } };
};

function GameOutlet() {
	const navigate = useNavigate();
	const refNavigate = useRef(navigate);
	const refSocket = useRef<Socket>(null);

	const [gameState, setGameState]: [GameStateType, Function] = useState({
		cards: [],
		isRoundFinished: false,
		gameStats: null,
		players: {},
	});
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

		socket.on("update-state", (newState) => {
			console.log("game state updating", newState);
			setGameState(newState);
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
	}, [refSocket, refNavigate, setGameState]);

	if (isConnected) {
		return <Outlet context={[refSocket, gameState]} />;
	} else {
		return <LoadingDots />;
	}
}

export default GameOutlet;

type ContextType = [React.MutableRefObject<Socket>, GameStateType];

export function useGameContext() {
	return useOutletContext<ContextType>();
}
