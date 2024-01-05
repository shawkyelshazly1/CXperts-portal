import React from "react";
import TeamVacationRequestsTable from "./TeamVacationRequestsTable";

export default function TeamVacationRequests() {
	return (
		<div className="flex flex-col gap-6 w-full">
			<hr />
			<h1 className="text-3xl font-medium italic text-gray-500">
				Team Requests
			</h1>

			<TeamVacationRequestsTable />
		</div>
	);
}
