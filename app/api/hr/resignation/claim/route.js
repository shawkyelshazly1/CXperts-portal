import { claimResignation, loadResignation } from "@/helpers/hr/resignations";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
	const token = await getToken({ req });
	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	// #TODO: Check if user is HR only
	if (
		token.user?.department?.name !== "human_resources" &&
		token.user?.department?.name !== "information_technology"
	) {
		return new Response("Not Authorized", { status: 401 });
	}

	let body = await req.json();
	const resignationId = body.resignationId;

	let resignationClaimed = await claimResignation(
		parseInt(resignationId),
		token?.user?.employeeId
	);

	if (resignationClaimed.error) {
		return new Response(resignationClaimed.error, { status: 422 });
	}
	if (resignationClaimed) {
		return NextResponse.json(resignationClaimed);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
