import PositionsTable from "@/components/admin/positions/PositionsTable";
import AddPositionModal from "@/components/admin/positions/addPositionModal/AddPositionModal";
import React, { Suspense } from "react";
import { ClipLoader } from "react-spinners";

export default function Page() {
	return (
		<div className="w-full  flex container gap-4">
			<div className="flex flex-col h-full w-full py-4 gap-4">
				<div className="flex flex-row w-full justify-between ">
					<h1 className="text-2xl text-gray-400 font-semibold italic">
						Positions
					</h1>
					<div className="flex flex-row gap-1 self-end">
						<AddPositionModal />
						{/* <button className=" bg-secondary text-white py-2 px-4 rounded-xl font-semibold">
							ADD BULK
						</button> */}
					</div>
				</div>

				<Suspense fallback={<ClipLoader color="#1770b8" size={40} />}>
					<PositionsTable />
				</Suspense>
			</div>
		</div>
	);
}
