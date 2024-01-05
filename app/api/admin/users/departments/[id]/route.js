import {
	loadDepartments,
	loadSubDepartment,
	loadUsers,
} from "@/helpers/admin/user";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
	const token = await getToken({ req });
	let id = params.id;

	if (token.user.department.name !== "information_technology") {
		return new Response("Not Authorized", { status: 401 });
	}

	let subDepartments = await loadSubDepartment(parseInt(id));

	if (subDepartments) {
		return NextResponse.json(subDepartments);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
