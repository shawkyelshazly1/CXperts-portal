import { loadTeamRequestsCount } from "@/helpers/vacation";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
	const token = await getToken({ req });
	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	let requestsCount = await loadTeamRequestsCount(token?.user.id);
	requestsCount = { count: requestsCount };
	if (requestsCount) {
		return NextResponse.json(requestsCount);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
