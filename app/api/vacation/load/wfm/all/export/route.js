import { exportEmployeesVacationRequests } from "@/helpers/hr/vacation";
import { exportAgentsVacationRequests } from "@/helpers/wfm/vacation";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
	const token = await getToken({ req });
	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	if (
		token.user?.department?.name !== "workforce_management" &&
		token.user?.department?.name !== "information_technology"
	) {
		return new Response("Not Authorized", { status: 401 });
	}

	let departments =
		req.nextUrl.searchParams.get(["department"]) === ""
			? []
			: req.nextUrl.searchParams.get(["department"]).split(",");

	let from =
		req.nextUrl.searchParams.get(["from"]) === ""
			? ""
			: req.nextUrl.searchParams.get(["from"]);

	let to =
		req.nextUrl.searchParams.get(["to"]) === ""
			? ""
			: req.nextUrl.searchParams.get(["to"]);

	let employeeId =
		req.nextUrl.searchParams.get(["employeeId"]) === ""
			? ""
			: req.nextUrl.searchParams.get(["employeeId"]);

	let approvalStatuses =
		req.nextUrl.searchParams.get(["approvalStatus"]) === ""
			? []
			: req.nextUrl.searchParams.get(["approvalStatus"]).split(",");

	let requests = await exportAgentsVacationRequests(
		departments,
		from,
		to,
		employeeId,
		approvalStatuses
	);

	if (requests) {
		return NextResponse.json(requests);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
