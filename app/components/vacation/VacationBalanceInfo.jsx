import { authOptions } from "@/api/auth/[...nextauth]/route";
import { loadUserVacationBalance } from "@/helpers/vacation";
import { getServerSession } from "next-auth";
import S from "underscore.string";
import RequestVacationDialog from "./RequestVacationDialog";

export default async function VacationBalanceInfo() {
	const vacationTypes = ["business_trip", "annual", "casual", "sick"];

	const { user } = await getServerSession(authOptions);

	// load user consumed balance during the year
	const usedBalance = await loadUserVacationBalance(user?.id);

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
				{vacationTypes.map((vacationType, idx) => (
					<div
						className="flex flex-col items-center bg-slate-200 py-4 gap-3 rounded-lg w-full"
						key={idx}
					>
						<h1 className="text-xl font-medium text-gray-500">
							{vacationType
								.split("_")
								.map((vacationType) => S(vacationType).capitalize().value())
								.join(" ")}
						</h1>
						<h1 className="text-4xl font-medium text-black">
							{vacationType === "annual" ? (
								user.vacationBalance
							) : (
								<>
									{vacationType === "casual"
										? usedBalance["casual"] === 0 ||
										  Object.keys(usedBalance).length === 0
											? 6
											: 6 - parseInt(usedBalance["casual"])
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
