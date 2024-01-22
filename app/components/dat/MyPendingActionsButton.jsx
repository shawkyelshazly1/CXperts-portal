"use client";
export default function MyPendingActionsButton() {
	return (
		<button
			className=" bg-secondary text-white py-2 px-4 rounded-xl font-semibold"
			onClick={() => {
				window.open("/dat/pending_actions", "_blank");
			}}
		>
			View Pending Actions
		</button>
	);
}
