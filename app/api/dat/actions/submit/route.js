import {
	applyAction,
	getNextApplicableAction,
	isPreviousActionPendingApproval,
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

	// apply action
	let action = await applyAction(
		body.employeeId,
		body.incidentDate,
		body.actionCategory,
		token.user?.employeeId
	);

	if (action.error) {
		return NextResponse.json({ error: action.error }, { status: 400 });
	}

	if (action) {
		return NextResponse.json(action);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
