import { exportToCsv } from "@/helpers/dat/actions";
import { TextField } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
export default function ExtractHistoryForm() {
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault(); // Prevent the default form submit action

		// validate if both dates are present
		if (!fromDate || !toDate) {
			toast.error("Please select both dates");
			return;
		}

		if (new Date(fromDate) > new Date(toDate)) {
			toast.error("From date cannot be greater than To date");
			return;
		}

		// Perform the data export
		try {
			toast.promise(
				fetch("api/dat/actions/export", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ fromDate, toDate }),
				})
					.then((res) => {
						if (!res.ok) {
							throw new Error("Failed to fetch raw data");
						}
						return res.json();
					})
					.then((data) => {
						console.log(data);
						exportToCsv(data);
					}),
				{
					loading: "Exporting data...",
					success: "Data exported successfully!",
					error: "Error exporting data",
				}
			);
		} catch (error) {
			console.error("Error during data export:", error);
			toast.error("Error exporting data");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white shadow-md rounded  pt-6 pb-8 mb-4 w-full"
		>
			<div className="mb-4">
				<TextField
					label="From"
					type="date"
					variant="outlined"
					value={fromDate}
					onChange={(e) => setFromDate(e.target.value)}
					className="w-full"
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</div>
			<div className="mb-6">
				<TextField
					label="To"
					type="date"
					variant="outlined"
					value={toDate}
					onChange={(e) => setToDate(e.target.value)}
					className="w-full"
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</div>
			<div className="flex items-center justify-between ">
				<button
					className="bg-blue-500 mx-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					type="submit"
				>
					Export Data
				</button>
			</div>
		</form>
	);
}
