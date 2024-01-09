import React from "react";
import SickVacationRequestsTable from "./SickVacationRequestsTable";

export default function SickVacationRequests() {
	return (
		<div className="flex flex-col gap-6 w-full">
			<hr />
			<h1 className="text-3xl font-medium italic text-gray-500">
				Pending Sick Requests
			</h1>

			<SickVacationRequestsTable />
		</div>
	);
}
