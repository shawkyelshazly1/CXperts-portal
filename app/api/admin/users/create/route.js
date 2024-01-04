import { createUser } from "@/helpers/admin/user";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
	const token = await getToken({ req });

	if (token.user.department.name !== "information_technology") {
		return new Response("Not Authorized", { status: 401 });
	}

	let body = await req.json();

	let employeeInfo = await createUser(body);

	if (employeeInfo) {
		return NextResponse.json(employeeInfo);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
