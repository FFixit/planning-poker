import { TGameStateObject } from "../../../common/types/TGameStateObject";
import LoadingDots from "../../../misc/LoadingDots";
import "./GameStats.css";

type GameStatsArgs = {
	gameStats: TGameStateObject["gameStats"];
};

function GameStats({ gameStats }: GameStatsArgs) {
	const otherStrings =
		(gameStats &&
			gameStats.others
				.filter((entry) => typeof entry.key !== "undefined")
				.map((entry) => entry.count + "x" + entry.key)
				.join(", ")) ||
		"-";
	return (
		<div className="game-stats">
			<h1>Game Stats</h1>
			{gameStats ? (
				<div className="table-container">
					<table>
						<tbody>
							<tr>
								<td>Average</td>
								<td>{gameStats.average || "-"}</td>
							</tr>
							<tr>
								<td>Median</td>
								<td>{gameStats.median || "-"}</td>
							</tr>
							<tr>
								<td>Others</td>
								<td>{otherStrings}</td>
							</tr>
						</tbody>
					</table>
				</div>
			) : (
				<LoadingDots />
			)}
		</div>
	);
}

export default GameStats;
