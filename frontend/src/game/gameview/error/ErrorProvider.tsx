import React, { useState } from "react";
import ErrorPage from "./ErrorPage";

const ErrorContext = React.createContext<[(error: string) => void] | undefined>(
	undefined
);

type ErrorProviderArgs = {};

export function ErrorProvider(
	props: React.PropsWithChildren<ErrorProviderArgs>
) {
	const [error, setError] = useState("");

	const clearError = () => {
		setError("");
	};

	return (
		<ErrorContext.Provider value={[setError]}>
			{error ? (
				<ErrorPage error={error} clearError={clearError} />
			) : (
				props.children
			)}
		</ErrorContext.Provider>
	);
}

export function useError() {
	const context = React.useContext(ErrorContext);
	if (context === undefined) {
		throw new Error("useError cannot be used outside of an ErrorProvider");
	}

	return context;
}
