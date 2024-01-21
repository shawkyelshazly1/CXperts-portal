import { loadResignationUpdates } from "@/helpers/hr/resignations";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
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

	const id = req.url.split("/load/")[1];

	let resignationUpdates = await loadResignationUpdates(parseInt(id));

	if (resignationUpdates.error) {
		return new Response(resignationUpdates.error.message, { status: 422 });
	}

	if (resignationUpdates) {
		return NextResponse.json(resignationUpdates);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
