import ResetPasswordForm from "@/components/resetPassword/ResetPasswordForm";
import { Cabin } from "next/font/google";
import React from "react";

const cabin = Cabin({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export default function Page() {
	return (
		<div className="w-full container flex flex-col items-center justify-center gap-8">
			<h1
				className={`text-5xl font-mono font-semibold text-primary ${cabin.className}`}
			>
				Reset Password
			</h1>
			<ResetPasswordForm />
		</div>
	);
}
