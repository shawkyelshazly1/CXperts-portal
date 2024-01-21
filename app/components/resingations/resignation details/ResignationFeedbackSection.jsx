import React from "react";
import ResignationUpdatesView from "./resignation updates seciton/ResignationUpdatesView";
import AddResignationUpdateForm from "./resignation updates seciton/AddResignationUpdateForm";

export default function ResignationFeedbackSection({ resignation }) {
	return (
		<div className="w-full h-full  gap-3 flex flex-col p-2 rounded-lg bg-gray-100/40 ">
			<ResignationUpdatesView resignationId={resignation.id} />
			<AddResignationUpdateForm
				resignationId={resignation.id}
				resignationStatus={resignation.status}
			/>
		</div>
	);
}
