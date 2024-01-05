import AuthProvider from "@/components/AuthProvider";
import login_bg from "@/public/login-bg.svg";
export default async function RootLayout({ children }) {
	return (
		<AuthProvider>
			<div
				className="flex w-full h-screen justify-center items-center"
				style={{ backgroundImage: `url(${login_bg.src})` }}
			>
				{children}
			</div>
		</AuthProvider>
	);
}
