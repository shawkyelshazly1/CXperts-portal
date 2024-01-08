import { Roboto } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });
import Image from "next/image";
import logoPic from "@/public/logo.png";

export default async function Home() {
	return (
		<main className="flex flex-col  container py-6 items-center justify-center gap-10">
			<h1
				className={`font-mono ${roboto.className} text-[#2866b1] text-7xl flex flex-row items-center font-semibold`}
			>
				Welcome To Employee Portal
			</h1>
			<Image src={logoPic} alt="go-call-logo" width={250} height={250} />{" "}
			<h1 className="text-4xl font-medium text-[#fab21a]">
				Innovate.Interact.Inspire
			</h1>
		</main>
	);
}
