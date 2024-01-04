import { createDepartment } from "@/helpers/admin/department";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
	const token = await getToken({ req });

	if (token.user.department.name !== "information_technology") {
		return new Response("Not Authorized", { status: 401 });
	}

	let body = await req.json();

	let departmentInfo = await createDepartment(body);

	if (departmentInfo) {
		return NextResponse.json(departmentInfo);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
