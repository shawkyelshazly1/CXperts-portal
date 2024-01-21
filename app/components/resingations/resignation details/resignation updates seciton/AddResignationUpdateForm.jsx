"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AddResignationUpdateForm({
	resignationId,
	resignationStatus,
}) {
	const [update, setUpdate] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();

		if (update.trim() === "") {
			toast.error("Please insert a valid feedback");
			return;
		}

		if (resignationStatus !== "processing") {
			switch (resignationStatus) {
				case "pending":
					toast.error("Please insert a valid feedback.");
					return;
				case "recalled":
					toast.error("Resignation recalled by employee.");
					return;
				case "retained":
					toast.error("Employee retained already.");
					return;
			}
		}

		// send api request to submit Resignation
		toast.promise(
			fetch("/api/hr/resignation/updates/new", {
				method: "POST",
				body: JSON.stringify({
					content: update.toString().trim(),
					resignationId,
				}),
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error("Failed to add feedback");
					}
					return res.json();
				})
				.then((data) => {
					if (data.error) {
						throw new Error(data.error);
					}

					setUpdate("");
				}),
			{
				loading: "Adding feedback...",
				success: "Feedback added successfully!",
				error: "Failed to add feedback.",
			}
		);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full flex flex-row items-center gap-2"
		>
			<textarea
				onChange={(e) => {
					setUpdate(e.target.value);
				}}
				type="text"
				value={update}
				className="flex-1 border-[1px] rounded-2xl p-2 focus:outline-none focus:border-primary"
				placeholder="Insert Update Here"
				rows={3}
				disabled={resignationStatus !== "processing"}
			/>
			<button
				disabled={resignationStatus !== "processing"}
				className="bg-primary text-white py-2 px-4 font-semibold h-full rounded-xl"
			>
				Submit
			</button>
		</form>
	);
}
