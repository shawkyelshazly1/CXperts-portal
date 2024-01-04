import { authOptions } from "@/api/auth/[...nextauth]/route";
import TeamVacationRequests from "@/components/vacation/TeamVacationRequests";
import VacationBalanceInfo from "@/components/vacation/VacationBalanceInfo";
import VacationRequestsHistory from "@/components/vacation/VacationRequestsHistory";
import { getServerSession } from "next-auth";

export default async function Page() {
	const { user } = await getServerSession(authOptions);
	return (
		<div className="w-full container h-full flex flex-col gap-16 relative">
			<VacationBalanceInfo />
			<VacationRequestsHistory />
			{user._count.subordinates < 1 ||
			user?.position.title === "team_leader" ? (
				<></>
			) : (
				<TeamVacationRequests />
			)}
		</div>
	);
}
