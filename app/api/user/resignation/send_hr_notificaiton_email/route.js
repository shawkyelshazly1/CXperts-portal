import { sendResignationSubmittedHRNotificationEmail } from "@/helpers/emails";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req, res) {
	const token = await getToken({ req });
	if (!token) {
		// Not authenticated
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	let body = await req.json();

	let { email, employee, resignation } = body;

	try {
		if (email) {
			await sendResignationSubmittedHRNotificationEmail(
				email,
				employee,
				resignation
			);
		}

		return NextResponse.json(
			{
				message:
					"Resignation Submitted HR Notification email sent successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
