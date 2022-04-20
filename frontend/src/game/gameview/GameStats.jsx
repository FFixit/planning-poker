import "./GameStats.css";

function GameStats({ gameState }) {
	return (
		<div className="game-stats">
			<h1>Game Stats</h1>
			<div className="table-container">
				<table>
					<tbody>
						<tr>
							<td>Average</td>
							<td>45</td>
						</tr>
						<tr>
							<td>Median</td>
							<td>12</td>
						</tr>
						<tr>
							<td>Others</td>
							<td>🆎</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default GameStats;
