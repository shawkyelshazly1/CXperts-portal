import { resetUserPassword } from "@/helpers/admin/user";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
	const token = await getToken({ req });

	if (token.user.department.name !== "information_technology") {
		return new Response("Not Authorized", { status: 401 });
	}

	let body = await req.json();

	//reset here
	let result = await resetUserPassword(body.userId, body.password);

	if (result && !result.error) {
		return NextResponse.json(result);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
