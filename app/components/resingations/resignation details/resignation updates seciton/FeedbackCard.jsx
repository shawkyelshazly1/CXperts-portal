import moment from "moment";
import S from "underscore.string";

export default function FeedbackCard({ feedback }) {
	return (
		<div className="flex flex-col gap-1 bg-gray-200 rounded-xl w-full py-2 px-4">
			<div className="flex flex-row gap-2 text-gray-600 font-bold text-base items-center">
				<h1>
					{S(feedback.createdBy?.firstName).capitalize().value() +
						" " +
						S(feedback.createdBy?.lastName).capitalize().value()}
				</h1>
				<span className="text-gray-400 text-sm">
					{moment(feedback.createdAt).format("dddd DD-MMM-YYYY")}
				</span>
			</div>
			<p className="pl-4">{feedback.content}</p>
		</div>
	);
}
