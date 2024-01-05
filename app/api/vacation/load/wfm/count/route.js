import { loadProjectRequestsCount } from "@/helpers/wfm/vacation";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
	const token = await getToken({ req });
	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	let projects =
		req.nextUrl.searchParams.get(["project"]) === ""
			? []
			: req.nextUrl.searchParams.get(["project"]).split(",");

	let requestsCount = await loadProjectRequestsCount(projects);
	requestsCount = { count: requestsCount };
	if (requestsCount) {
		return NextResponse.json(requestsCount);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
