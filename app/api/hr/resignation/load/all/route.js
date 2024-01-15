import { loadEmployeesResignations } from "@/helpers/hr/resignations";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
	const token = await getToken({ req });
	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	if (
		token.user?.department?.name !== "human_resources" &&
		token.user?.department?.name !== "information_technology"
	) {
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

	let employeeId =
		req.nextUrl.searchParams.get(["employeeId"]) === ""
			? ""
			: req.nextUrl.searchParams.get(["employeeId"]);

	let resignationStatuses =
		req.nextUrl.searchParams.get(["resignationStatus"]) === ""
			? []
			: req.nextUrl.searchParams.get(["resignationStatus"]).split(",");

	let resignations = await loadEmployeesResignations(
		parseInt(req.nextUrl.searchParams.get(["skip"])),
		parseInt(req.nextUrl.searchParams.get(["take"])),
		departments,
		positions,
		employeeId,
		resignationStatuses
	);

	if (resignations) {
		return NextResponse.json(resignations);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
