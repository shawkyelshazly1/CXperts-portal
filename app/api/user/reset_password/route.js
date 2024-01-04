import { resetUserPassword } from "@/helpers/user/user";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
	const token = await getToken({ req });

	if (!token?.user) {
		return new Response("Not Authorized", { status: 401 });
	}

	let body = await req.json();

	let changedPassword = await resetUserPassword({
		...body,
		userId: token?.user.id,
	});

	if (changedPassword) {
		return NextResponse.json(changedPassword);
	} else {
		return new Response("Something went wrong!", { status: 422 });
	}
}
