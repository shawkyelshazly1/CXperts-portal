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

const baseUrl = process.env.URL ? `http://localhost:3000` : "";

export default function VacationRequiredApprovalEmail({
	employeeID,
	employeeName,
	vacationType,
	from,
	to,
}) {
	const previewText = `Vacation Request Requires Approval`;
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
								A vacation request is pending your feedback!
							</Heading>

							<Text className="text-white text-[15px]  font-normal text-center mt-8 p-0 mx-0">
								We&lsquo;ve recieved a request with the following details.
							</Text>

							<Section className="mt-[12px] mx-auto w-3/4">
								<Text className="text-start mx-0 my-0 text-white/80 font-normal">
									<strong className="text-white">EmployeeID:</strong>{" "}
									{employeeID}
								</Text>
								<Text className="text-start mx-0 my-0 text-white/80 font-normal">
									<strong className="text-white">Employee Name:</strong>{" "}
									{employeeName}
								</Text>
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
							<Text className="text-white text-center text-[15px]  font-normal  mt-8 p-0 mx-0">
								Please access portal to submit your feedback for the above
								request.
							</Text>
							<Section className="text-center mt-[32px] mb-[32px]">
								<Button
									pX={20}
									pY={12}
									className="bg-[#ecca49] rounded text-[#4264f0] text-[12px] text-2xl font-semibold py-2 px-4 font-semibold no-underline text-center"
									href={`${baseUrl}/vacation`}
								>
									View Pending Requests
								</Button>
							</Section>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
