import { loadPositions } from "@/helpers/admin/position";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
	const token = await getToken({ req });

	if (token.user.department.name !== "information_technology") {
		return new Response("Not Authorized", { status: 401 });
	}

	let positions = await loadPositions(
		parseInt(req.nextUrl.searchParams.get(["skip"])),
		parseInt(req.nextUrl.searchParams.get(["take"]))
	);

	if (positions) {
		return NextResponse.json(positions);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
