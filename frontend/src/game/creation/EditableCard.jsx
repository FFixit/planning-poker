import "./EditableCard.css";

function EditableCard({ key, value, onChange, onRemove }) {
	const onChangeHandler = (event) => {
		let inputValue = event.target.value;
		let newValue = isNaN(parseInt(inputValue))
			? inputValue
			: parseInt(inputValue).toString();

		onChange(key, newValue);
	};

	const onRemoveHandler = () => {
		onRemove(key);
	};

	return (
		<div className="editable-card">
			<div className="input-card">
				<input type="text" value={value} onChange={onChangeHandler} />
			</div>
			<button className="remove-button" onClick={onRemoveHandler}>
				Remove
			</button>
		</div>
	);
}

export default EditableCard;
