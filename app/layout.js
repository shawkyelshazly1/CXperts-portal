import Header from "./components/headers/Header";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";
import { Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";


const roboto = Roboto({
	subsets: ["latin"],
	weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata = {
	title: "CXperts - Portal",
	description: "CXperts Employees Portal",
};

export default async function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={roboto.className}>
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
