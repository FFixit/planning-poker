import "./Card.css";

type CardArgs = {
	active: boolean;
	value: string;
	selected: boolean;
	index: number;
	onClick: (index: number) => void;
};

function Card({ active, value, selected, index, onClick }: CardArgs) {
	let classNames = ["card", "player-card"];
	if (selected) {
		classNames.push("selected");
	}
	if (!active) {
		classNames.push("disabled");
	}
	return (
		<div
			className={classNames.join(" ")}
			onClick={() => {
				if (active) {
					onClick(index);
				}
			}}
		>
			<p>{value}</p>
		</div>
	);
}

export default Card;
