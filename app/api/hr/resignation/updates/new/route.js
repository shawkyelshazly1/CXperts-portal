import { addResignationFeedback } from "@/helpers/hr/resignations";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
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

	let body = await req.json();

	let addedFeedback = await addResignationFeedback(
		body.resignationId,
		token?.user?.employeeId,
		body.content
	);

	if (addedFeedback.error) {
		return new Response(addedFeedback.error.message, { status: 422 });
	}

	if (addedFeedback) {
		return NextResponse.json(addedFeedback);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
