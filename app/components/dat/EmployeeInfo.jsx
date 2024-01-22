import React from "react";
import S from "underscore.string";

export default function EmployeeInfo({ employee }) {
	return (
		<div className="flex flex-col gap-1 items-center">
			<h1 className="text-primary font-medium text-xl">
				{S(employee?.employeeId).capitalize().value()}
			</h1>
			<h1 className="text-primary font-medium text-2xl">
				{S(employee?.firstName).capitalize().value() +
					" " +
					S(employee?.lastName).capitalize().value()}
			</h1>

			<h1 className="text-primary font-medium text-xl">
				{employee?.position?.title
					.split("_")
					.map((word) => S(word).capitalize().value())
					.join(" ")}
			</h1>
			<h1 className="text-primary font-medium text-xl">
				{employee?.project?.name
					.split("_")
					.map((word) => S(word).capitalize().value())
					.join(" ")}
			</h1>
			<hr className="h-8 w-full mt-1" />
		</div>
	);
}
