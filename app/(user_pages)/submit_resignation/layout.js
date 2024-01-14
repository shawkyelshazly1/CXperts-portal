import AuthProvider from "@/components/AuthProvider";
import login_bg from "@/public/login-bg.svg";
export default async function RootLayout({ children }) {
	return (
		<div className="flex w-full justify-center items-center">
			{children}
		</div>
	);
}
