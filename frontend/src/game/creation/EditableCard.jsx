import "./EditableCard.css";

function EditableCard({ index, value, onChange, onRemove }) {
	const onChangeHandler = (event) => {
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
