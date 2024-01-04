import { loadDepartments } from "@/helpers/admin/user";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
	const token = await getToken({ req });

	if (token.user.department.name !== "information_technology") {
		return new Response("Not Authorized", { status: 401 });
	}

	let departments = await loadDepartments();

	if (departments) {
		return NextResponse.json(departments);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
