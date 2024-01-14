import { updateEmployee } from "@/helpers/hr/employee";
import { resetUserPassword } from "@/helpers/user/user";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
	const token = await getToken({ req });

	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	if (token.user?.department?.name !== "human_resources") {
		return new Response("Not Authorized", { status: 401 });
	}

	let formData = await req.formData();

	let body = {};

	for (const item of formData.entries()) {
		if (item[0] === "employeeInfo")
			body = { ...body, employeeInfo: JSON.parse(item[1]) };
		else if (item[0] === "employeeId") body = { ...body, employeeId: item[1] };
		else if (body.documents) {
			body = {
				...body,
				documents: [
					...body.documents,
					{ documentName: item[0], file: item[1] },
				],
			};
		} else {
			body = {
				...body,
				documents: [{ documentName: item[0], file: item[1] }],
			};
		}
	}

	let updatedEmployee = await updateEmployee(
		body.employeeId,
		body.employeeInfo,
		body.documents
	);

	if (updateEmployee.error) {
		return NextResponse.json({ error: updateEmployee.error }, { status: 400 });
	}

	if (updatedEmployee) {
		return NextResponse.json(updatedEmployee);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
