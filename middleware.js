import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse, userAgent } from "next/server";

export default withAuth(
	// getting token to middleware
	async function middleware(req) {
		const token = await getToken({ req });
		const isAuthenticated = !!token;

		// force reset password on first login
		if (
			isAuthenticated &&
			token.user.LoginDetails.reset_required &&
			!req.nextUrl.pathname.startsWith("/reset_password")
		) {
			if (!req.nextUrl.pathname.startsWith("/api"))
				return NextResponse.redirect(new URL("/reset_password", req.url));
		}

		// login page and not authenticated
		if (req.nextUrl.pathname.startsWith("/login") && isAuthenticated) {
			return NextResponse.redirect(new URL("/", req.url));
		}

		// protect admin pages
		if (
			req.nextUrl.pathname.startsWith("/admin") &&
			token.user?.department.name !== "information_technology"
		) {
			return NextResponse.redirect(new URL("/", req.url));
		}

		// // protect vacation page from agents
		// if (
		// 	req.nextUrl.pathname.startsWith("/vacation") &&
		// 	token.user?.position.title === "representative"
		// ) {
		// 	return NextResponse.redirect(new URL("/", req.url));
		// }

		// protect hr pages
		if (
			req.nextUrl.pathname.startsWith("/hr") &&
			token.user?.department.name !== "human_resources"
		) {
			return NextResponse.redirect(new URL("/", req.url));
		}
	},
	{
		pages: {
			signIn: "/login",
		},
	}
);
