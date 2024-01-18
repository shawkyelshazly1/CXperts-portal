import { loadResignation } from "@/helpers/hr/resignations";
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

	const id = req.url.split("/view/")[1];

	let resignation = await loadResignation(parseInt(id));

	if (resignation) {
		return NextResponse.json(resignation);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
