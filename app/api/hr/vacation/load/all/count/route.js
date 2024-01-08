import { loadEmployeesVacationRequestsCount } from "@/helpers/hr/vacation";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
	const token = await getToken({ req });
	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	if (token.user?.department?.name !== "human_resources") {
		return new Response("Not Authorized", { status: 401 });
	}

	let departments =
		req.nextUrl.searchParams.get(["department"]) === ""
			? []
			: req.nextUrl.searchParams.get(["department"]).split(",");

	let positions =
		req.nextUrl.searchParams.get(["position"]) === ""
			? []
			: req.nextUrl.searchParams.get(["position"]).split(",");

	let from =
		req.nextUrl.searchParams.get(["from"]) === ""
			? ""
			: req.nextUrl.searchParams.get(["from"]);

	let to =
		req.nextUrl.searchParams.get(["to"]) === ""
			? ""
			: req.nextUrl.searchParams.get(["to"]).split("}")[0];

	

	let requestsCount = await loadEmployeesVacationRequestsCount(
		departments,
		positions,
		from,
		to
	);
	requestsCount = { count: requestsCount };

	if (requestsCount) {
		return NextResponse.json(requestsCount);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
