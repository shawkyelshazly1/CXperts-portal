// app/api/admin/users/send-welcome-emails/route.js
import { sendWelcomeEmail } from "@/helpers/emails";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req, res) {
	const token = await getToken({ req });
	if (!token) {
		// Not authenticated
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	let body = await req.json();

	let { employees } = body;

	if (!employees || employees.length === 0) {
		return NextResponse.json(
			{ error: "No employee emails provided" },
			{ status: 400 }
		);
	}

	try {
		for (const employee of employees) {
			if (employee.email) {
				await sendWelcomeEmail(
					employee.username,
					employee.password,
					employee.email
				);
			}
		}
		return NextResponse.json(
			{ message: "Welcome emails sent successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
