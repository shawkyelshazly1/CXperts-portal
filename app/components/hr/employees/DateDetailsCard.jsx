import moment from "moment";

export default function DateDetailsCard({ title, value }) {
	return (
		<div className="flex flex-col bg-gray-100 py-2 px-4 rounded-lg gap-1">
			<h1 className="text-sm text-slate-400">{title}</h1>
			<h1 className="">{moment(value).format("DD-MMM-YYYY")}</h1>
		</div>
	);
}
