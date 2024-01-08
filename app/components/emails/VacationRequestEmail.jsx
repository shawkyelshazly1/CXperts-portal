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

export default function VacationRequestEmail({ vacationType, from, to }) {
	const previewText = `Vacation Request Submitted!`;
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
								Thank you for submitting your vacation request!
							</Heading>

							<Text className="text-white text-[15px]  font-normal text-center mt-8 p-0 mx-0">
								We&lsquo;ve recieved your request with the following details.
							</Text>

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
							</Section>
							<Text className="text-white text-start text-[15px]  font-normal  mt-8 p-0 mx-0">
								<strong>Reminder:</strong> Your request doesn&lsquo;t serve as
								the final approval for your vacation; it is currently awaiting
								managerial approval. You will be notified via email once a
								decision has been made regarding the approval or rejection of
								your request. Thank you for your understanding.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
