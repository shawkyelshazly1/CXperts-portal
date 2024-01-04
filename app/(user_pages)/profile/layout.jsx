import React from "react";

export default function layout({ children }) {
	return (
		<div className="flex w-full h-screen justify-center items-center">
			{children}
		</div>
	);
}
