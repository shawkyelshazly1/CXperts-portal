"use client";

import toast from "react-hot-toast";

export default function RecallResignationButton({ resignation }) {
	const handleRecallResignation = () => {
		// send api request to submit Resignation

		if (!window.confirm("Are you sure you want to recall your resignation?")) {
			return;
		}
		toast.promise(
			fetch("/api/user/resignation/recall", {
				method: "POST",
				body: JSON.stringify({
					resignationId: resignation.id,
				}),
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error("Failed to recall Resignation");
					}
					return res.json();
				})
				.then((data) => {
					if (data.error) {
						throw new Error(data.error);
					}
					setTimeout(() => window.location.reload(), 2000);
				}),
			{
				loading: "Recalling resignation...",
				success: "Resignation recalled successfully! Refreshing page...",
				error: "Failed to recall resignation.",
			}
		);
	};

	return (
		<button
			className="bg-green-500 text-white py-2 px-6 rounded-lg font-medium "
			onClick={() => {
				handleRecallResignation();
			}}
		>
			Recall
		</button>
	);
}
