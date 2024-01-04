import React from "react";
import AgentsVacationRequestsTable from "./AgentsVacationRequestsTable";

export default function AgentsVacationRequests() {
	return (
		<div className="flex flex-col gap-6 w-full">
			<hr />
			<h1 className="text-3xl font-medium italic text-gray-500">
				Agents Requests
			</h1>

			<AgentsVacationRequestsTable />
		</div>
	);
}
