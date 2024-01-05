import { updateRequestStatus } from "@/helpers/wfm/vacation";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
	const token = await getToken({ req });
	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	let body = await req.json();

	let updatedRequest = await updateRequestStatus(body, token?.user);

	if (updatedRequest) {
		return NextResponse.json(updatedRequest);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
