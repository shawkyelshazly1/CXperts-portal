import { getEmployeeActions } from "@/helpers/dat/actions";
import { loadEmployee } from "@/helpers/dat/employee";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
	const token = await getToken({ req });
	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	// #TODO: Check if user is HR only
	if (
		token.user?.department?.name !== "human_resources" &&
		token.user?.department?.name !== "operations" &&
		token.user?.department?.name !== "information_technology"
	) {
		return new Response("Not Authorized", { status: 401 });
	}

	const employeeId = req.url.split("/employee/")[1];

	let employee = await loadEmployee(employeeId);

	if (employee.error) {
		return NextResponse.json({ error: employee?.error }, { status: 422 });
	}

	if (employee) {
		return NextResponse.json({ employee });
	} else {
		return NextResponse.json(
			{ message: "Something went wrong!" },
			{ status: 422 }
		);
	}
}
