import { loadVacationRequests } from "@/helpers/vacation";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
	const token = await getToken({ req });
	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	let requests = await loadVacationRequests(
		parseInt(token?.user.id),
		parseInt(req.nextUrl.searchParams.get(["skip"])),
		parseInt(req.nextUrl.searchParams.get(["take"]))
	);

	if (requests) {
		return NextResponse.json(requests);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
