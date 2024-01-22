import { approveAction, getPendingActions } from "@/helpers/dat/actions";
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
		token.user?.department?.name !== "operations" &&
		token.user?.department?.name !== "information_technology"
	) {
		return new Response("Not Authorized", { status: 401 });
	}

	let body = await req.json();

	let approvedAction = await approveAction(
		parseInt(body.actionId),
		token.user?.employeeId
	);

	if (approvedAction?.error) {
		return new Response(approvedAction?.error?.message, { status: 422 });
	}

	if (approvedAction) {
		return NextResponse.json(approvedAction);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
