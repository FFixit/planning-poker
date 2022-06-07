import "./ErrorPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { MouseEventHandler } from "react";
import { useNavigate } from "react-router-dom";

type ErrorPageArgs = {
	error: string;
	clearError: () => void;
};

export default function ErrorPage({ error, clearError }: ErrorPageArgs) {
	const navigate = useNavigate();

	const errorMessage =
		typeof error === "string" ? error : JSON.stringify(error);

	const tryAgain: MouseEventHandler = (event) => {
		event.preventDefault();
		clearError();
	};

	const goBack: MouseEventHandler = (event) => {
		event.preventDefault();
		navigate("/");
	};
	return (
		<div className="error-page">
			<span className="error-icon">
				<FontAwesomeIcon icon={faTriangleExclamation} />
			</span>
			<p>{errorMessage}</p>
			<div className="error-buttons">
				<button className="button" onClick={tryAgain}>
					Try again
				</button>
				<button className="button" onClick={goBack}>
					Back
				</button>
			</div>
		</div>
	);
}
