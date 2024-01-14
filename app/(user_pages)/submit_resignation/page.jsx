import { authOptions } from "@/api/auth/[...nextauth]/route";
import ResignationForm from "@/components/resingations/ResignationForm";
import ResignationView from "@/components/resingations/ResignationView";
import { getUserResignation } from "@/helpers/user/user";
import { getServerSession } from "next-auth";

export default async function Page() {
	const { user } = await getServerSession(authOptions);
	let userResignation = await getUserResignation(user?.employeeId);

	return (
		<div className="w-full  flex flex-col gap-3 h-full  ">
			{userResignation ? (
				<ResignationView resignation={userResignation} />
			) : (
				<div className="flex flex-col gap-3 items-center justify-center h-full w-full">
					<h1 className="text-3xl font-medium ">Submit Resignation</h1>
					<ResignationForm />
				</div>
			)}
		</div>
	);
}
