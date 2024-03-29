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

		// protect hr pages
		if (
			req.nextUrl.pathname.startsWith("/hr") &&
			token.user?.department.name !== "human_resources" &&
			token.user?.department.name !== "information_technology"
		) {
			return NextResponse.redirect(new URL("/", req.url));
		}

		// protect wfm pages
		if (
			req.nextUrl.pathname.startsWith("/wfm") &&
			token.user?.department.name !== "workforce_management" &&
			token.user?.department.name !== "information_technology"
		) {
			return NextResponse.redirect(new URL("/", req.url));
		}

		// protect dat pages
		if (
			req.nextUrl.pathname.startsWith("/dat") &&
			token.user?.department.name !== "general_management" &&
			token.user?.department.name !== "human_resources" &&
			token.user?.department.name !== "operations" &&
			token.user?.department.name !== "information_technology"
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
