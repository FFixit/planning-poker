import LoadingDots from "../../misc/LoadingDots";
import "./Player.css";

function Player({ name, value }) {
	let displayValue,
		cssClasses = ["card", "other-player-card"];
	if (typeof value === "boolean" && value === true) {
		displayValue = <p>?</p>;
		cssClasses.push("value-picked");
	} else if (typeof value === "number") {
		displayValue = <p>{value}</p>;
	} else {
		displayValue = <LoadingDots />;
	}
	return (
		<div className="player">
			<div className={cssClasses.join(" ")}>{displayValue}</div>
			<div className="player-name">
				<p>{name}</p>
			</div>
		</div>
	);
}

export default Player;
