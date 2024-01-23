import Header from "./components/headers/Header";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
	title: "CXperts - Portal",
	description: "CXperts Employees Portal",
};

export default async function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="font-body">
				<AuthProvider>
					<Header />
					<div className="min-h-[calc(92.9vh)]  justify-center flex ">
						{children}
					</div>
					<Toaster />
				</AuthProvider>
			</body>
		</html>
	);
}
