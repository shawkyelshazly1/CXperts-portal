import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import S from "underscore.string";
import moment from "moment";

const baseUrl = process.env.URL ? `https://localhost:3000` : "";

export default function VacationRequestFeedbackEmail({
	vacationType,
	from,
	to,
	status,
	managerName,
}) {
	const previewText = `Vacation Request Feedback!`;
	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans">
					<Container className="border bg-[#4264f0] border-solid  rounded my-[40px] mx-auto p-[20px] w-[520px]">
						<Section className="mt-[12px] mb-4">
							<Img
								src={`https://i.ibb.co/Lx23nSz/image-2.png`}
								width="100"
								height="100"
								alt="CXperts-Logo"
								className="my-0 mx-auto"
							/>
						</Section>
						<Section className="border-2 border-white/20 rounded-xl border-solid p-4 m-4 mx-auto">
							<Heading className="text-white text-[20px] font-semibold text-center p-0 my-[20px] mx-0">
								Your request with the below details has been{" "}
								<span
									className={`${
										status === "approved"
											? "text-green-500  rounded-3xl "
											: "text-red-500"
									}`}
								>
									{S(status).capitalize().value()}{" "}
									{status === "approved" ? "✅" : "❌"}
								</span>
							</Heading>

							<Section className="mt-[12px] mx-auto w-3/4">
								<Text className="text-start mx-0 my-0 text-white/80 font-normal">
									<strong className="text-white">Vacation Type:</strong>{" "}
									{vacationType
										?.split("_")
										.map((word) => S(word).capitalize().value())
										.join(" ")}
								</Text>
								<Text className="text-start mx-0 my-0 text-white/80 font-normal">
									<strong className="text-white">From:</strong>{" "}
									{moment(from).format("MM/DD/YYYY")}
								</Text>
								<Text className="text-start mx-0 my-0 text-white/80 font-normal">
									<strong className="text-white">To:</strong>{" "}
									{moment(to).format("MM/DD/YYYY")}
								</Text>
								<Text className="text-start mx-0 my-0 text-white/80 font-normal">
									<strong className="text-white">Manager:</strong>{" "}
									{managerName
										?.split("_")
										.map((word) => S(word).capitalize().value())
										.join(" ")}
								</Text>
							</Section>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
