import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StartPage from "./startpage/StartPage";
import GameCreation from "./game/creation/GameCreation";
import GamePage from "./game/gameview/GamePage";
import GameOutlet from "./game/gameview/GameOutlet";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<StartPage />} />
			<Route path="game" element={<GameOutlet />}>
				<Route index element={<GameCreation />} />
				<Route path=":sessionId" element={<GamePage />} />
			</Route>
			<Route
				path="*"
				element={
					<main style={{ padding: "1rem" }}>
						<p>Error: Not found</p>
					</main>
				}
			/>
		</Routes>
	</BrowserRouter>
);
