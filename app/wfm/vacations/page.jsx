import AgentsVacationRequests from "@/components/wfm/vacation/AgentsVacationRequests";
import ClearFiltersButton from "@/components/wfm/vacation/ClearFiltersButton";
import EmployeesVacationRequests from "@/components/wfm/vacation/EmployeesVacationRequests";
import ExportLeavesButton from "@/components/wfm/vacation/ExportLeavesButton";
import FilterPane from "@/components/wfm/vacation/FilterPane";
import { loadFilters } from "@/helpers/wfm/vacation";

import { Suspense } from "react";
import { ClipLoader } from "react-spinners";

export default async function Page() {
	let filters = await loadFilters();

	return (
		<div className="w-full flex container gap-4">
			<div className="flex flex-col h-full w-full py-4 gap-4 container items-center">
				<div className="flex flex-row w-full container justify-between gap-4 bg-white mt-[-16px]  py-4 px-6">
					<h1 className="text-2xl text-gray-400 font-semibold italic">
						VACATIONS
					</h1>
					<div className="flex flex-row gap-1">
						<FilterPane filters={filters} />
						<ClearFiltersButton />
						<ExportLeavesButton />
					</div>
				</div>
				<EmployeesVacationRequests />

				<AgentsVacationRequests />
			</div>
		</div>
	);
}
