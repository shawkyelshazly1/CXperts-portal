import { submitResignation } from "@/helpers/user/user";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
	const token = await getToken({ req });

	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	let body = await req.json();

	let submittedResignation = await submitResignation(
		token?.user?.employeeId,
		body
	);

	if (submittedResignation) {
		return NextResponse.json(submittedResignation);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
