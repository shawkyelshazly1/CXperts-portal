import { loadPositions } from "@/helpers/admin/user";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
	const token = await getToken({ req });

	if (token.user.department.name !== "information_technology") {
		return new Response("Not Authorized", { status: 401 });
	}

	let id = params.id;

	let positions = await loadPositions(parseInt(id));

	if (positions) {
		return NextResponse.json(positions);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
