import CloseResignationModal from "@/components/resingations/resignation details/close resignation/CloseResignationModal";
import ResignationFullView from "@/components/resingations/resignation details/ResignationFullView";
import { loadResignationFullDetails } from "@/helpers/hr/resignations";

export default async function Page({ params }) {
	//  load resignation by ID
	const { id } = params;
	let resignation = await loadResignationFullDetails(parseInt(id));

	const statusColorMap = {
		pending: "bg-amber-500",
		processing: "bg-purple-500",
		recalled: "bg-green-500",
		retained: "bg-green-500",
		completed: "bg-red-500",
	};

	return (
		<div className="w-full flex container gap-4">
			<div className="flex flex-col h-full w-full py-4 gap-4 container items-center">
				<div className="flex flex-row w-full container justify-between  bg-white mt-[-16px]  py-4 px-6 items-center">
					<div className="flex flex-col">
						<div className="flex flex-row items-center gap-4">
							<h1 className="text-2xl text-gray-400 font-semibold italic">
								RESIGNATION DETAILS
							</h1>
							<span
								className={`rounded-full py-2 px-4 capitalize text-white font-semibold ${
									statusColorMap[resignation?.status.toLowerCase()] || ""
								}`}
							>
								{resignation?.status}
							</span>
						</div>
						<h1 className="text-2xl  text-gray-400 font-semibold italic flex flex-row gap-0">
							ID:#{resignation?.id}
						</h1>
					</div>
					{resignation.status === "processing" && (
						<CloseResignationModal resignationId={resignation.id} />
					)}
				</div>
				<ResignationFullView resignation={resignation} />
			</div>
		</div>
	);
}
