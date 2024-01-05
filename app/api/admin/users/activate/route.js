import { activateEmployee } from "@/helpers/admin/user";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
	const token = await getToken({ req });

	if (token.user.department.name !== "information_technology") {
		return new Response("Not Authorized", { status: 401 });
	}

	let body = await req.json();

	//disable here
	let result = await activateEmployee(body.userId);

	if (result && !result.error) {
		return NextResponse.json(result);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
