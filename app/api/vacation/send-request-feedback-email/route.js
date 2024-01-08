// app/api/admin/users/send-welcome-emails/route.js
import {
	sendVacationRequestFeedbackEmail,
	sendVacationRequestManagerEmail,
	sendVacationRequestSubmissionEmail,
} from "@/helpers/emails";
import prisma from "@/prisma/index";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req, res) {
	const token = await getToken({ req });
	if (!token) {
		// Not authenticated
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	let body = await req.json();

	let { requestId, status } = body;

	let vacationRequest = await prisma.vacationRequest.findUnique({
		where: { id: parseInt(requestId) },
		include: {
			approvedByManager: {
				select: {
					firstName: true,
					lastName: true,
				},
			},
			employee: {
				select: {
					email: true,
				},
			},
		},
	});

	try {
		if (vacationRequest) {
			await sendVacationRequestFeedbackEmail(
				vacationRequest.reason,
				vacationRequest.employee.email,
				vacationRequest.from,
				status,
				vacationRequest.to,
				vacationRequest.approvedByManager.firstName +
					"_" +
					vacationRequest.approvedByManager.lastName
			);
		}

		return NextResponse.json(
			{ message: "Request feedback email sent successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
