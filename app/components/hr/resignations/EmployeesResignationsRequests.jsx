import React from "react";
import EmployeesResignationsRequestsTable from "./EmployeesResignationsRequestsTable";

export default function EmployeesResignationsRequests() {
	return (
		<div className="flex flex-col gap-6 w-full">
			<hr />
			<h1 className="text-3xl font-medium italic text-gray-500">
				Employees Resignation Requests
			</h1>

			<EmployeesResignationsRequestsTable />
		</div>
	);
}
