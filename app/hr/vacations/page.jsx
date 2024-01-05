import FilterPane from "@/components/hr/vacations/FilterPane";
import { loadFilters, loadHRVacationRequests } from "@/helpers/hr/vacation";
import { Suspense } from "react";
import { ClipLoader } from "react-spinners";

export default async function Page({ searchParams }) {
	let filters = await loadFilters();

	let vacationRequests = await loadHRVacationRequests(searchParams);

	console.log(vacationRequests);

	return (
		<div className="w-full flex container gap-4">
			<div className="flex flex-col h-full w-full py-4 gap-4 container items-center">
				<div className="flex flex-col w-full container justify-between gap-4 bg-white mt-[-16px]  py-4 px-6">
					<h1 className="text-2xl text-gray-400 font-semibold italic">
						VACATIONS
					</h1>
					<FilterPane filters={filters} />
					<hr />
				</div>

				{/* <Suspense
					fallback={<ClipLoader color="#1770b8" size={40} />}
				></Suspense> */}
			</div>
		</div>
	);
}
