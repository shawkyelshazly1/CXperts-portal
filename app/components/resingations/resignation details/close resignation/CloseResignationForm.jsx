"use client";
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";

const statuses = ["completed", "retained"];

export default function CloseResignationForm({ resignationId }) {
	const [formData, setFormData] = useState({
		status: "",
		resolution: "",
		resignationId,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (formData.status === "") {
			toast.error("Please selecte a valid status.");
			return;
		}

		if (formData.resolution.trim() === "") {
			toast.error("Please input a valid resolution for the resignation.");
			return;
		}
		// send api request to submit Resignation
		toast.promise(
			fetch("/api/hr/resignation/update", {
				method: "POST",
				body: JSON.stringify({
					...formData,
					resolution: formData.resolution.trim(),
				}),
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error("Failed to update Resignation");
					}
					return res.json();
				})
				.then((data) => {
					if (data.error) {
						throw new Error(data.error);
					} else {
						setTimeout(() => window.location.reload(), 2000);
					}
				}),
			{
				loading: "Updating resignation...",
				success: "Resignation updated successfully! Refreshing page...",
				error: "Failed to update resignation.",
			}
		);
	};

	return (
		<div className="p-4  mx-auto shadow-md rounded">
			<form className="space-y-4" onSubmit={handleSubmit}>
				<FormControl required fullWidth>
					<InputLabel id="status-simple-select-label">
						Resignation Status
					</InputLabel>

					<Select
						labelId="status-simple-select-label"
						id="status-simple-select"
						label="Resignation Status"
						name="status"
						required
						value={formData.status}
						onChange={handleChange}
						MenuProps={{
							PaperProps: {
								style: {
									maxHeight: 50 * 4.5,
									width: "250px",
									overflow: "auto",
								},
							},
						}}
					>
						{statuses.map((status, idx) => (
							<MenuItem key={idx} value={status}>
								<span
									className={` text-white text-center text-base py-1 px-3 rounded-full font-semibold capitalize w-fit ${
										status === "completed" ? "bg-red-500" : "bg-green-500"
									}`}
								>
									{status}
								</span>
							</MenuItem>
						))}
					</Select>
					{formData.status === "completed" ? (
						<p className="text-sm text-red-500 mt-1">
							* Please note that employee account will be disabled on the spot.
						</p>
					) : (
						<></>
					)}
				</FormControl>
				<TextField
					id="filled-multiline-flexible"
					label="Resolution"
					name="resolution"
					multiline
					rows={4}
					className="w-full"
					variant="outlined"
					placeholder="Type your resolution here..."
					required
					onChange={handleChange}
				/>
				<button
					type="submit"
					className="bg-blue-500 w-full text-2xl text-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Close Resignation
				</button>
			</form>
		</div>
	);
}
