import { loadEmployeesPendingResignations } from "@/helpers/hr/resignations";
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

	let pendingResignations = await loadEmployeesPendingResignations(
		parseInt(req.nextUrl.searchParams.get(["skip"])),
		parseInt(req.nextUrl.searchParams.get(["take"]))
	);

	if (pendingResignations) {
		return NextResponse.json(pendingResignations);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
