import EmployeesSection from "@/components/hr/employees/EmployeesSection";
import ExtractModal from "@/components/hr/employees/ExtractModal";
import DepartmentFilter from "@/components/hr/employees/filters/DepartmentFilter";
import PositionFilter from "@/components/hr/employees/filters/PositionFilter";
import SearchBar from "@/components/hr/employees/filters/SearchBar";
import { loadFilters, searchEmployees } from "@/helpers/hr/employee";
import React, { Suspense } from "react";
import { ClipLoader } from "react-spinners";

export default async function Page({ searchParams }) {
	let employees = await searchEmployees(searchParams);
	let filters = await loadFilters();

	return (
		<div className="w-full flex container gap-4">
			<div className="flex flex-col h-full w-full py-4 gap-4 container items-center">
				<div className="flex flex-col w-full container justify-between gap-4 bg-white mt-[-16px] py-4 px-6">
					<h1 className="text-2xl text-gray-400 font-semibold italic">
						EMPLOYEES
					</h1>
					<div className="flex flex-col xl:flex-row justify-evenly gap-3 w-full items-center">
						<div className="flex flex-col items-start self-start flex-1 w-full ">
							<SearchBar />
						</div>
						<div className="flex flex-col xl:flex-row xl:gap-2  items-center">
							<DepartmentFilter departments={filters.departments} />
							<PositionFilter positions={filters.positions} />
							<ExtractModal employees={employees} />
						</div>
					</div>
					<hr />
				</div>

				<Suspense fallback={<ClipLoader color="#1770b8" size={40} />}>
					<EmployeesSection employees={employees} />
				</Suspense>
			</div>
		</div>
	);
}
