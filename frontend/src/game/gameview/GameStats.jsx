import LoadingDots from "../../misc/LoadingDots";
import "./GameStats.css";

function GameStats({ gameStats }) {
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
								<td>
									{gameStats.others
										.map(
											(entry) =>
												entry.count + "x" + entry.key
										)
										.join(", ") || "-"}
								</td>
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
