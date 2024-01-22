import {
	getNextApplicableAction,
	isPreviousActionPendingApproval,
	loadActions,
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

	const body = await req.json();

	let actions = await loadActions(body.fromDate, body.toDate);

	if (actions.error) {
		return new Response(actions?.error?.message, { status: 422 });
	}

	if (actions) {
		return NextResponse.json(actions);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
