import { updateSickRequestStatus } from "@/helpers/hr/vacation";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
	const token = await getToken({ req });
	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	if (token.user?.department?.name !== "human_resources") {
		return new Response("Not Authorized", { status: 401 });
	}

	let body = await req.json();

	let updatedRequest = await updateSickRequestStatus(
		body,
		token?.user.employeeId
	);

	if (updatedRequest) {
		return NextResponse.json(updatedRequest);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
