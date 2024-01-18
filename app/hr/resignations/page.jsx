import ClearFiltersButton from "@/components/hr/resignations/ClearFiltersButton";
import EmployeesResignations from "@/components/hr/resignations/EmployeesResignations";
import EmployeesResignationsRequests from "@/components/hr/resignations/EmployeesResignationsRequests";
import ExportResignationsButton from "@/components/hr/resignations/ExportResignationsButton";
import FilterPane from "@/components/hr/resignations/FilterPane";
import { loadFilters } from "@/helpers/hr/employee";

export default async function Page({ searchParams }) {
	let filters = await loadFilters();

	return (
		<div className="w-full flex container gap-4">
			<div className="flex flex-col h-full w-full py-4 gap-4 container items-center">
				<div className="flex flex-row w-full container justify-between  bg-white mt-[-16px]  py-4 px-6">
					<h1 className="text-2xl text-gray-400 font-semibold italic">
						RESIGNATIONS
					</h1>
					<div className="flex flex-row gap-1">
						<FilterPane filters={filters} />
						<ClearFiltersButton />
						<ExportResignationsButton />
					</div>
				</div>

				<EmployeesResignations />
				<EmployeesResignationsRequests />
			</div>
		</div>
	);
}
