// app/api/admin/users/send-welcome-emails/route.js
import {
	sendVacationRequestManagerEmail,
	sendVacationRequestSubmissionEmail,
} from "@/helpers/emails";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req, res) {
	const token = await getToken({ req });
	if (!token) {
		// Not authenticated
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	let body = await req.json();

	let { vacationType, email, from, to, employeeId, employeeName } = body;

	try {
		if (email) {
			await sendVacationRequestManagerEmail(
				vacationType,
				email,
				from,
				to,
				employeeId,
				employeeName
			);
		}

		return NextResponse.json(
			{ message: "Manager approval reqeuest email sent successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
