import "./GameTimer.css";

export default function GameTimer({ value }) {
	const hasValue = typeof value === "number";

	if (hasValue) {
		let valueClasses = ["game-timer-value"];
		if (value <= 5) {
			valueClasses.push("game-timer-value-critical");
		}
		return (
			<div className="game-timer">
				<span className="game-timer-text">Time left: </span>
				<span className={valueClasses.join(" ")}>{value + "s"}</span>
			</div>
		);
	} else {
		return <div className="game-timer"></div>;
	}
}
