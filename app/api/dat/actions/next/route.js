import {
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

	let nextApplicableAction = await getNextApplicableAction(
		body.actionCategory,
		body.employeeId,
		body.incidentDate
	);

	if (nextApplicableAction.error) {
		return new Response(nextApplicableAction?.error?.message, { status: 422 });
	}

	let pendingApproval = await isPreviousActionPendingApproval(
		body.actionCategory,
		body.employeeId,
		body.incidentDate
	);

	if (pendingApproval.error) {
		return new Response(pendingApproval?.error?.message, { status: 422 });
	}

	if (nextApplicableAction && !pendingApproval?.error) {
		return NextResponse.json({
			nextAction: nextApplicableAction,
			pendingApproval: pendingApproval,
		});
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
