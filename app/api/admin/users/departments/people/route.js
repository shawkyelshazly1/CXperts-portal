import { loadDepartmentPeople } from "@/helpers/admin/user";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
	const token = await getToken({ req });

	if (token.user.department.name !== "information_technology") {
		return new Response("Not Authorized", { status: 401 });
	}

	let query = req.url.split("?")[1].split("&");
	let departmentId = query[0].split("=")[1];
	let positionId = query[1].split("=")[1];

	let managers = await loadDepartmentPeople(
		parseInt(departmentId),
		parseInt(positionId)
	);

	if (managers) {
		return NextResponse.json(managers);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
