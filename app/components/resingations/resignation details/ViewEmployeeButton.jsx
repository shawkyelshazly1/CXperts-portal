"use client";

import React from "react";

export default function ViewEmployeeButton({ employeeId }) {
	return (
		<button
			onClick={() => {
				window.open(
					`/hr/employees?search=${employeeId}`,
					"_blank"
				);
			}}
			className="rounded-xl bg-primary text-white py-2 px-4 font-semibold w-fit mt-8"
		>
			View Employee Full Details
		</button>
	);
}
