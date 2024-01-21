"use client";
import ResignationUpdatesView from "./resignation updates seciton/ResignationUpdatesView";
import AddResignationUpdateForm from "./resignation updates seciton/AddResignationUpdateForm";
import { useState } from "react";

export default function ResignationFeedbackSection({ resignation }) {
	const [updates, setUpdates] = useState([]);
	return (
		<div className="w-full h-full  gap-3 flex flex-col p-2 rounded-lg bg-gray-100/40 ">
			<ResignationUpdatesView
				resignationId={resignation.id}
				setUpdates={setUpdates}
				updates={updates}
			/>
			<AddResignationUpdateForm
				resignationId={resignation.id}
				resignationStatus={resignation.status}
				setUpdates={setUpdates}
				updates={updates}
			/>
		</div>
	);
}
