import { useState } from "react";
import "./PlayerCreation.css";

function PlayerCreation({ onPlayerCreation }) {
	const [name, setName] = useState("Player");

	const validate = () => {
		return typeof name === "string" && name !== "";
	};

	return (
		<div className="player-creation">
			<form
				className="player-creation-form"
				onSubmit={() => {
					onPlayerCreation(name);
				}}
			>
				<label>
					Name:
					<input
						type="text"
						name="name"
						value={name}
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
