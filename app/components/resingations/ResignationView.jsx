import moment from "moment";
import S from "underscore.string";
import RecallResignationButton from "./RecallResignationButton";
import ExtendLastWorkingDateModal from "./adjust date modal/ExtendLastWorkingDateModal";

export default function ResignationView({ resignation }) {
	return (
		<div className="flex flex-col gap-3 self-start   w-full h-full">
			<div className="w-3/4 mx-auto flex flex-col gap-4 mt-6">
				<h1 className="text-3xl font-medium text-gray-400">Resignation</h1>
				<div className="flex flex-row justify-evenly text-center ">
					<div className="flex flex-col w-full border-2">
						<h1 className="bg-primary py-2 px-4 text-white font-medium">
							Submission Date
						</h1>
						<div className="py-2 px-4 h-full flex items-center justify-center">
							<h1>
								{moment(resignation?.submissionDate).format("DD-MMM-YYYY")}
							</h1>
						</div>
					</div>
					<div className="flex flex-col w-full border-2">
						<h1 className="bg-primary py-2 px-4 text-white font-medium">
							Reason
						</h1>
						<div className="py-2 px-4 h-full flex items-center justify-center">
							<h1>
								{resignation?.reason
									?.split("_")
									.map((word) => S(word).capitalize().value())
									.join(" ")}
							</h1>
						</div>
					</div>
					<div className="flex flex-col w-full border-2">
						<h1 className="bg-primary py-2 px-4 text-white font-medium">
							Comment
						</h1>
						<div className="py-2 px-4 h-full flex items-center justify-center">
							<p className="break-words">
								{S(resignation?.updates[0].content)
									.truncate(100)
									.lines()
									.join("<br />")}
							</p>
						</div>
					</div>
					<div className="flex flex-col w-full border-2">
						<h1 className="bg-primary py-2 px-4 text-white font-medium">
							Last Working Date
						</h1>
						<div className="py-2 px-4 h-full flex items-center justify-center">
							<h1>
								{moment(resignation?.lastWorkingDate).format("DD-MMM-YYYY")}
							</h1>
						</div>
					</div>
					<div className="flex flex-col w-full border-2">
						<h1 className="bg-primary py-2 px-4 text-white font-medium">
							Status
						</h1>
						<div className="py-2 px-4 h-full flex justify-center items-center">
							<h1
								className={`py-2 px-4  inline-flex rounded-3xl font-medium text-white w-fit self-center ${
									resignation?.status === "pending"
										? "bg-amber-500"
										: resignation?.status === "processing"
										? "bg-purple-500"
										: resignation?.status === "recalled" ||
										  resignation?.status === "retained"
										? "bg-green-500"
										: resignation?.status === "completed"
										? "bg-red-500"
										: ""
								}`}
							>
								{S(resignation?.status).capitalize().value()}
							</h1>
						</div>
					</div>
					<div className="flex flex-col w-full border-2">
						<h1 className="bg-primary py-2 px-4 text-white font-medium">
							Actions
						</h1>
						<div className="py-2 px-4 h-full flex items-center justify-center flex-col gap-2 ">
							<RecallResignationButton resignation={resignation} />
							<ExtendLastWorkingDateModal resignation={resignation} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
