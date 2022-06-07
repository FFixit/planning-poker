import "./GameOutlet.css";
import { Outlet } from "react-router-dom";
import { ErrorProvider } from "./error/ErrorProvider";
import { SocketProvider } from "./components/SocketProvider";

export default function GameOutlet() {
	return (
		<ErrorProvider>
			<SocketProvider>
				<Outlet />
			</SocketProvider>
		</ErrorProvider>
	);
}
