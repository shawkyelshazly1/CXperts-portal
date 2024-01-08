import React from "react";
import EmployeesVacationRequestsTable from "./EmployeesVacationRequestsTable";

export default function EmployeesVacationRequests() {
	return (
		<div className="flex flex-col gap-6 w-full">
			<hr />
			<h1 className="text-3xl font-medium italic text-gray-500">
				Employees Requests
			</h1>

			<EmployeesVacationRequestsTable />
		</div>
	);
}
