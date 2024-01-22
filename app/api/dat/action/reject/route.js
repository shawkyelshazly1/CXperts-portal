import {
	approveAction,
	getPendingActions,
	rejectAction,
} from "@/helpers/dat/actions";
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

	let rejectedAction = await rejectAction(
		parseInt(body.actionId),
		token.user?.employeeId
	);

	if (rejectedAction?.error) {
		return new Response(rejectedAction?.error?.message, { status: 422 });
	}

	if (rejectedAction) {
		return NextResponse.json(rejectedAction);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
