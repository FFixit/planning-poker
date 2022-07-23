import { FormEventHandler, useState } from "react";
import "./PlayerCreation.css";

type PlayerCreationArgs = {
	onPlayerCreation: (name: string) => void;
};

function PlayerCreation({ onPlayerCreation }: PlayerCreationArgs) {
	const [name, setName] = useState("Player");

	const checkInputValidity: FormEventHandler<HTMLInputElement> = (event) => {
		const target = event.target as HTMLInputElement;
		const currentValue = target.value;
		if (currentValue.length < 3) {
			target.setCustomValidity("Name must be at least 3 characters long");
		} else if (currentValue.length > 15) {
			target.setCustomValidity(
				"Name cannot be longer than 15 characters"
			);
			target.reportValidity();
		} else {
			target.setCustomValidity("");
		}
		target.checkValidity();
	};

	const validate = () => {
		const playerNameInput =
			document.querySelector<HTMLInputElement>("#player-name-input");
		return (
			typeof name === "string" &&
			name !== "" &&
			playerNameInput?.checkValidity()
		);
	};

	return (
		<div className="player-creation">
			<form
				className="player-creation-form"
				onSubmit={(event) => {
					event.preventDefault();
					onPlayerCreation(name);
				}}
			>
				<label>
					Name:
					<input
						id="player-name-input"
						type="text"
						name="name"
						value={name}
						onInput={checkInputValidity}
						onChange={(event) => setName(event.target.value)}
					/>
				</label>
				<input
					className="button"
					disabled={!validate()}
					type="submit"
					value="Join Game"
				/>
			</form>
		</div>
	);
}

export default PlayerCreation;
