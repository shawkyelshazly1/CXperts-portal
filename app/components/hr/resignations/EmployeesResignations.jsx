import React from "react";
import EmployeesResignationsTable from "./EmployeesResignationsTable";

export default function EmployeesResignations() {
	return (
		<div className="flex flex-col gap-6 w-full">
			<h1 className="text-3xl font-medium italic text-gray-500">
				Employees Resignations
			</h1>

			<EmployeesResignationsTable />
		</div>
	);
}
