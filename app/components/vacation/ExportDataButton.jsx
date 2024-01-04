"use client";

import { exportToCsv } from "@/helpers/vacation";
import toast from "react-hot-toast";
import { FaFileExport } from "react-icons/fa";

export default function ExportDataButton() {
	// load all user requests
	async function loadRequests() {
		await fetch(`/api/vacation/load/all`, { method: "GET" })
			.then(async (res) => {
				return await res.json();
			})
			.then((data) => {
				exportToCsv(data);
			})
			.catch((error) => toast.error("Something went wrong!"))
			.finally(() => {
				toast.success("Data Exported.");
			});
	}

	return (
		<button
			onClick={() => {
				loadRequests();
			}}
			className="rounded-3xl py-2 self-end px-4 w-fit bg-green-500 text-white font-medium flex flex-row items-center gap-3"
		>
			Export History <FaFileExport />
		</button>
	);
}
