import { FormEvent, FormEventHandler, useState } from "react";
import "./PlayerCreation.css";

type PlayerCreationArgs = {
	onPlayerCreation: (name: string) => void;
};

function PlayerCreation({ onPlayerCreation }: PlayerCreationArgs) {
	const [name, setName] = useState("Player");
	const [isValid, setValid] = useState(true);

	const updateValidity = (
		inputElement: HTMLInputElement,
		newValue: string
	) => {
		if (newValue.length < 3) {
			inputElement.setCustomValidity(
				"Name must be at least 3 characters long"
			);
			setValid(false);
		} else if (newValue.length > 15) {
			inputElement.setCustomValidity(
				"Name cannot be longer than 15 characters"
			);
			inputElement.reportValidity();
			setValid(false);
		} else {
			inputElement.setCustomValidity("");
			setValid(true);
		}
	};

	const onChange = (event: FormEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		setName(target.value);
		updateValidity(target, target.value);
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
						onChange={onChange}
					/>
				</label>
				<input
					className="button"
					disabled={!isValid}
					type="submit"
					value="Join Game"
				/>
			</form>
		</div>
	);
}

export default PlayerCreation;
