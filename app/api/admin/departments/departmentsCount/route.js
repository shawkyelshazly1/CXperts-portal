import { getDepartmentsCount } from "@/helpers/admin/department";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
	const token = await getToken({ req });

	if (token.user.department.name !== "information_technology") {
		return new Response("Not Authorized", { status: 401 });
	}

	let departmentsCount = await getDepartmentsCount();

	if (departmentsCount) {
		return NextResponse.json(departmentsCount);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
