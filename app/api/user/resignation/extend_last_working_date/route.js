import { updateResignationLastWorkingDate } from "@/helpers/user/user";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
	const token = await getToken({ req });

	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	const body = await req.json();

	let updatedResignation = await updateResignationLastWorkingDate(
		parseInt(body.resignationId),
		token?.user?.employeeId,
		body.lastWorkingDate
	);

	if (updatedResignation) {
		return NextResponse.json(updatedResignation);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
