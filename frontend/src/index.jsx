import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import StartPage from "./startpage/StartPage";
import GameCreation from "./game/creation/GameCreation";
import Game from "./game/gameview/Game";
import GameMain from "./game/gameview/GameMain";

render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<StartPage />} />
			<Route path="game" element={<GameMain />}>
				<Route index element={<GameCreation />} />
				<Route path=":sessionId" element={<Game />} />
			</Route>
			<Route
				path="*"
				element={
					<main style={{ padding: "1rem" }}>
						<p>Error</p>
					</main>
				}
			/>
		</Routes>
	</BrowserRouter>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
