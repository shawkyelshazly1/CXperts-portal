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

const baseUrl = process.env.URL ? `https://localhost:3000` : "";

export default function WelcomeEmail({ username, password }) {
	const previewText = `Explore CXperts Employee Portal`;
	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans">
					<Container className="border bg-[#4264f0] border-solid  rounded my-[40px] mx-auto p-[20px] w-[520px]">
						<Section className="mt-[12px]">
							<Img
								src={`https://i.ibb.co/Lx23nSz/image-2.png`}
								width="175"
								height="175"
								alt="CXperts-Logo"
								className="my-0 mx-auto"
							/>
						</Section>
						<Heading className="text-white text-[40px] font-bold text-center p-0 my-[20px] mx-0">
							Welcome to CXperts Portal
						</Heading>
						<Section className="mt-[22px]">
							<Img
								src={`https://i.ibb.co/ZYxW4pM/image-1.png`}
								width="150"
								height="150"
								alt="lock-photo"
								className="my-0 mx-auto"
							/>
						</Section>
						<Text className="text-white text-[35px]  font-normal text-center mt-8 p-0 mx-0">
							Activate Your Account
						</Text>

						<Text className="text-center mx-0 text-white/80 font-normal ">
							Use the below credentials to access your account
						</Text>

						<Section className="mt-[12px]">
							<Text className="text-center mx-0 my-0 text-white/80 font-normal">
								<strong className="text-white">Username:</strong> {username}
							</Text>
							<Text className="text-center mx-0 my-0 text-white/80 font-normal">
								<strong className="text-white">Password:</strong> {password}
							</Text>
						</Section>
						<Section className="text-center mt-[32px] mb-[32px]">
							<Button
								pX={20}
								pY={12}
								className="bg-[#ecca49] rounded text-[#4264f0] text-[12px] text-2xl font-semibold py-2 px-4 font-semibold no-underline text-center"
								href={baseUrl}
							>
								Go To portal
							</Button>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
