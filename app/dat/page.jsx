import ActionsForm from "@/components/dat/ActionsForm";
import EmployeeActionHistory from "@/components/dat/EmployeeActionHistory";
import EmployeeInfo from "@/components/dat/EmployeeInfo";
import EmployeeSearch from "@/components/dat/EmployeeSearch";
import MyPendingActionsButton from "@/components/dat/MyPendingActionsButton";
import ExtractDataModal from "@/components/dat/extract data modal/ExtractDataModal";
import { loadEmployee } from "@/helpers/dat/employee";

export default async function Page({ searchParams }) {
	let employee = await loadEmployee(searchParams);

	return (
		<div className="w-full flex container gap-4">
			<div className="flex flex-col h-full w-full py-4 gap-4 container items-center">
				<div className="flex flex-col w-full container justify-between gap-4 bg-white mt-[-16px] py-4 px-6">
					<h1 className="text-2xl text-gray-400 font-semibold italic">
						DISCPLINARY ACTIONS
					</h1>
					<div className="flex flex-col xl:flex-row justify-evenly gap-3 w-full items-center">
						<div className="flex flex-col items-start self-start flex-1 w-full ">
							<EmployeeSearch />
						</div>
						<div className="flex flex-col xl:flex-row xl:gap-2  items-center">
							<MyPendingActionsButton />
							<ExtractDataModal />
						</div>
					</div>
					<hr />
				</div>
				{employee === undefined || employee?.error ? (
					<div className="flex w-full items-center justify-center">
						{employee?.error ? (
							<h1 className="text-red-500 font-medium text-xl">
								{employee?.error}
							</h1>
						) : (
							<h1 className="text-primary font-medium text-xl">
								Search For Employee
							</h1>
						)}
					</div>
				) : (
					<div className="flex w-full flex-col items-center justify-center">
						<EmployeeInfo employee={employee} />

						<ActionsForm employee={employee} />
						<hr className="w-full my-4" />
						<EmployeeActionHistory employeeId={employee?.employeeId} />
					</div>
				)}
			</div>
		</div>
	);
}
