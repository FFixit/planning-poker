import { ChangeEvent } from "react";
import "./EditableCard.css";

type EditableCardArgs = {
	index: number;
	value: string;
	onChange: (index: number, newValue: string) => void;
	onRemove: (index: number) => void;
};
function EditableCard({ index, value, onChange, onRemove }: EditableCardArgs) {
	const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		let inputValue = event.target.value;
		let newValue = isNaN(parseInt(inputValue))
			? inputValue
			: parseInt(inputValue).toString();

		onChange(index, newValue);
	};

	const onRemoveHandler = () => {
		onRemove(index);
	};

	return (
		<div className="editable-card">
			<div className="card input-card">
				<input type="text" value={value} onChange={onChangeHandler} />
			</div>
			<button className="remove-button" onClick={onRemoveHandler}>
				Remove
			</button>
		</div>
	);
}

export default EditableCard;
