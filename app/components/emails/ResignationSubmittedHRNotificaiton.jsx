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

export default function ResignationSubmittedHRNotificaiton({
	employeeID,
	employeeName,
	department,
	project,
	position,
	submissionDate,
	resignationReason,
	lastWorkingDate,
	comment,
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
								A Resignation has been submitted, pending review.
							</Heading>

							<Text className="text-white text-[15px]  font-normal text-center mt-8 p-0 mx-0">
								We&lsquo;ve recieved a resignation with the following details.
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
									<strong className="text-white">Department:</strong>{" "}
									{department
										?.split("_")
										.map((word) => S(word).capitalize().value())
										.join(" ")}
								</Text>
								{project && (
									<Text className="text-start mx-0 my-0 text-white/80 font-normal">
										<strong className="text-white">Project:</strong>{" "}
										{project
											?.split("_")
											.map((word) => S(word).capitalize().value())
											.join(" ")}
									</Text>
								)}
								<Text className="text-start mx-0 my-0 text-white/80 font-normal">
									<strong className="text-white">Position:</strong>{" "}
									{position
										?.split("_")
										.map((word) => S(word).capitalize().value())
										.join(" ")}
								</Text>
								<Text className="text-start mx-0 my-0 text-white/80 font-normal">
									<strong className="text-white">Submitted On:</strong>{" "}
									{moment(submissionDate).format("MM/DD/YYYY")}
								</Text>
								<Text className="text-start mx-0 my-0 text-white/80 font-normal">
									<strong className="text-white">Resignation Reason:</strong>{" "}
									{resignationReason
										?.split("_")
										.map((word) => S(word).capitalize().value())
										.join(" ")}
								</Text>
								<Text className="text-start mx-0 my-0 text-white/80 font-normal">
									<strong className="text-white">Last Working Date:</strong>{" "}
									{moment(lastWorkingDate).format("MM/DD/YYYY")}
								</Text>
								<Text className="text-start mx-0 my-0 text-white/80 font-normal">
									<strong className="text-white">Comment:</strong> {comment}
								</Text>
							</Section>
							<Text className="text-white text-center text-[15px]  font-normal  mt-8 p-0 mx-0">
								Please access portal to review the above request.
							</Text>
							<Section className="text-center mt-[32px] mb-[32px]">
								<Button
									pX={20}
									pY={12}
									className="bg-[#ecca49] rounded text-[#4264f0] text-[12px] text-2xl py-2 px-4 font-semibold no-underline text-center"
									href={`${baseUrl}/hr/resignations/review`}
								>
									View Resignation Requests
								</Button>
							</Section>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
