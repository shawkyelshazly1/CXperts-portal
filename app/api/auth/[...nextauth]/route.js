import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "@/helpers/auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/index";

export const authOptions = {
	pages: {
		signIn: "/login",
	},

	adaptr: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				username: { label: "Username", type: "text", placeholder: "Username" },
				password: {
					label: "Password",
					type: "password",
					placeholder: "Password",
				},
			},
			async authorize(credentials) {
				if (!credentials || !credentials.username || !credentials.password) {
					throw new Error("Invalid Credentials");
				}

				const employee = await loginUser(
					credentials.username,
					credentials.password
				);

				

				if (employee.error) {
					throw new Error(employee.error);
				}

				if (employee) {
					return Promise.resolve(employee);
				} else {
					console.log("here");
					throw new Error("Invalid username or password.");
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
		jwt: {
			maxAge: 86400,
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async jwt({ token, user }) {
			if (user && !user.error) {
				token.user = user;
			}
			return token;
		},
		async session({ session, token }) {
			session.user = token.user;

			// refetch user if logged In to update session
			if (token?.user?.id) {
				let updatedUser = await prisma.employee.findUnique({
					where: { id: token?.user.id },
					include: {
						manager: true,
						department: true,
						position: true,
						LoginDetails: {
							select: {
								reset_required: true,
							},
						},
						_count: {
							select: {
								subordinates: true,
							},
						},
					},
				});

				session.user = updatedUser;
				token.user = updatedUser;
			}

			return session;
		},
		async redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},
	},
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
