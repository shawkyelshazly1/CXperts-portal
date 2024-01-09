import ClearFiltersButton from "@/components/hr/vacations/ClearFiltersButton";
import EmployeesVacationRequests from "@/components/hr/vacations/EmployeesVacationRequests";
import ExportLeavesButton from "@/components/hr/vacations/ExportLeavesButton";
import FilterPane from "@/components/hr/vacations/FilterPane";
import SickVacationRequests from "@/components/hr/vacations/SickVacationRequests";
import { loadFilters } from "@/helpers/hr/vacation";

export default async function Page({ searchParams }) {
	let filters = await loadFilters();

	return (
		<div className="w-full flex container gap-4">
			<div className="flex flex-col h-full w-full py-4 gap-4 container items-center">
				<div className="flex flex-row w-full container justify-between  bg-white mt-[-16px]  py-4 px-6">
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

				<SickVacationRequests />
			</div>
		</div>
	);
}
