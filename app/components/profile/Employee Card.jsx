import React from "react";
import S from "underscore.string";

export default function EmployeeCard({ employee }) {
	return (
		<div className="flex flex-col bg-gray-100 py-2 px-4 rounded-lg gap-1">
			<h1 className="">
				{S(employee?.firstName).capitalize().value() +
					" " +
					S(employee?.lastName).capitalize().value()}
			</h1>
		</div>
	);
}
