import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GameStage } from "../../../common/types/GameStage";
import LoadingDots from "../../../misc/LoadingDots";
import "./Player.css";

type PlayerArgs = {
	gameStage: GameStage;
	self?: boolean;
	name: string;
	isAdmin: boolean;
	cards: string[];
	selected: number | true;
};

export default function Player({
	gameStage,
	self = false,
	name,
	isAdmin,
	cards,
	selected,
}: PlayerArgs) {
	const value = typeof selected === "number" ? cards[selected] : selected;

	let displayValue,
		cssClasses = ["card"];

	if (self) {
		cssClasses.push("self-player-card");

		if (typeof value === "string") {
			displayValue = (
				<>
					<p>{value}</p>
					<p>(You)</p>
				</>
			);
		} else {
			displayValue = <p>(You)</p>;
		}
	} else {
		cssClasses.push("other-player-card");

		if (typeof value === "boolean" && value === true) {
			displayValue = <p>?</p>;
			cssClasses.push("value-picked");
		} else if (typeof value === "string") {
			displayValue = <p>{value}</p>;
		} else {
			if (gameStage === GameStage.RoundFinished) {
				displayValue = <p>X</p>;
			} else {
				displayValue = <LoadingDots />;
			}
		}
	}

	const cardTooltip = typeof value === "string" ? value : "";

	return (
		<div className="player">
			<div className="admin-crown">
				{isAdmin && <FontAwesomeIcon icon={faCrown} />}
			</div>
			<div className={cssClasses.join(" ")} title={cardTooltip}>
				{displayValue}
			</div>
			<div className="player-name">
				<p title={name}>{name}</p>
			</div>
		</div>
	);
}
