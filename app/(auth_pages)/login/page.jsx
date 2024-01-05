import React from "react";
import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Page() {
	const data = await getServerSession(authOptions);

	if (data) {
		redirect("/");
	}

	return (
		<div className="container w-full h-full flex items-center justify-center">
			<LoginForm />
		</div>
	);
}
