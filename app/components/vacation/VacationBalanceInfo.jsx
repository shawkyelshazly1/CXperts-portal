import { authOptions } from "@/api/auth/[...nextauth]/route";
import { loadUserVacationBalance } from "@/helpers/vacation";
import { getServerSession } from "next-auth";
import S from "underscore.string";
import RequestVacationDialog from "./RequestVacationDialog";

export default async function VacationBalanceInfo() {
	const vacationTypes = ["business_trip", "annual", "casual", "sick"];

	const { user } = await getServerSession(authOptions);

	// load user consumed balance during the year
	const usedBalance = await loadUserVacationBalance(user?.employeeId);

	return (
		<div className="flex flex-col gap-6 w-full">
			<div className="flex flex-col-reverse md:flex-row justify-between">
				<h1 className="text-3xl font-medium italic text-gray-500">
					Current Balance
				</h1>
				<div className="self-end">
					<RequestVacationDialog />
				</div>
			</div>

			<div className=" grid grid-cols-2 lg:grid-cols-4 justify-between gap-12">
				{vacationTypes
					.filter(
						(vacationType) =>
							user?.position?.title !== "representative" ||
							vacationType === "annual"
					)
					.map((vacationType, idx) => (
						<div
							className="flex flex-col items-center bg-slate-200 py-4 gap-3 rounded-lg w-full"
							key={idx}
						>
							<h1 className="text-xl font-medium text-gray-500">
								{vacationType
									.split("_")
									.map((vt) => S(vt).capitalize().value())
									.join(" ")}
							</h1>
							<h1 className="text-4xl font-medium text-black">
								{vacationType === "annual" ? (
									user.vacationBalance - 6 > 0 ? (
										user.vacationBalance - 6
									) : (
										0
									)
								) : (
									<>
										{vacationType === "casual"
											? 6 - parseInt(usedBalance["casual"] || 0)
											: "_"}
									</>
								)}
							</h1>
						</div>
					))}
			</div>
		</div>
	);
}
