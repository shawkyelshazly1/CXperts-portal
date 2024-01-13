import { submitVacationRequest } from "@/helpers/vacation";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
	const token = await getToken({ req });
	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	let formData = await req.formData();

	let vacationData = {
		reason: formData.get("reason"),
		from: formData.get("from"),
		to: formData.get("to"),
		file: formData.get("file"),
	};

	let newRequest = await submitVacationRequest(
		vacationData,
		token?.user.employeeId
	);

	if (newRequest) {
		return NextResponse.json(newRequest);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
