import { useState } from "react";
import "./PlayerCreation.css";

function PlayerCreation({ onPlayerCreation }) {
	let [name, setName] = useState("Player");

	return (
		<form className="player-creation"
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
			<input type="submit" value="Submit" />
		</form>
	);
}

export default PlayerCreation;
