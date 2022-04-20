import "./EditableCard.css";

function EditableCard(props) {
	return (
		<div className="editable-card">
			<div className="input-card">
				<input
					type="text"
					value={props.value}
					onChange={props.onChange}
				/>
			</div>
            <button className="remove-button" onClick={props.onRemove}>Remove</button>
		</div>
	);
}

export default EditableCard;
