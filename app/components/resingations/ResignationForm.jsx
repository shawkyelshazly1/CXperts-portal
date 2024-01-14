"use client";
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

const reasons = [
	{ value: "better_compensation", title: "Better Compensation" },
	{ value: "personal_reasons", title: "Personal Reasons" },
	{ value: "work-life_balance", title: "Work-Life Balance" },
	{ value: "company_culture", title: "Company Culture" },
	{ value: "professional_development", title: "Professional Development" },
	{ value: "job_dissatisfaction", title: "Job Dissatisfaction" },
	{ value: "conflict_with_management", title: "Conflict with Management" },
	{ value: "team_dynamics", title: "Team Dynamics" },
	{ value: "company_restructuring", title: "Company Restructuring" },
	{ value: "retirement", title: "Retirement" },
	{ value: "entrepreneurship", title: "Entrepreneurship" },
	{ value: "health_issues", title: "Health Issues" },
	{ value: "educational_pursuits", title: "Educational Pursuits" },
	{ value: "job_redundancy", title: "Job Redundancy" },
	{ value: "job_commute", title: "Job Commute" },
	{ value: "contract_completion", title: "Contract Completion" },
	{ value: "better_work_environment", title: "Better Work Environment" },
	{ value: "burnout", title: "Burnout" },
	{ value: "other", title: "Other" },
];

export default function ResignationForm() {
	const { data: userData } = useSession();

	const [formData, setFormData] = useState({
		lastWorkingDate: "",
		reason: "",
		comment: "",
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

		// send api request to submit Resignation
		toast.promise(
			fetch("/api/user/resignation/submit", {
				method: "POST",
				body: JSON.stringify({
					...formData,
				}),
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error("Failed to submit Resignation");
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
				loading: "Submitting resignation...",
				success: "Resignation submitted successfully! Refreshing page...",
				error: "Failed to submit resignation.",
			}
		);
	};

	return (
		<div className="p-4 w-1/4 mx-auto shadow-md rounded">
			<form className="space-y-4" onSubmit={handleSubmit}>
				<LocalizationProvider dateAdapter={AdapterMoment}>
					<DatePicker
						label="Last Working Date"
						fullWidth
						className="w-full"
						minDate={moment().add(
							userData?.user?.position?.title === "representative" ? 14 : 30,
							"days"
						)}
						slotProps={{
							textField: {
								required: true,
								name: "lastWorkingDate",
							},
						}}
						onChange={(value) => {
							setFormData((prevState) => ({
								...prevState,
								lastWorkingDate: value.toISOString(),
							}));
						}}
					/>
				</LocalizationProvider>
				<FormControl required fullWidth>
					<InputLabel id="reason-simple-select-label">
						Resignation Reason
					</InputLabel>
					<Select
						labelId="reason-simple-select-label"
						id="reason-simple-select"
						label="Resignation Reason"
						name="reason"
						required
						value={formData.reason}
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
						{reasons.map((reason, idx) => (
							<MenuItem key={idx} value={reason.value}>
								{reason.title}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
					id="filled-multiline-flexible"
					label="Comment"
					name="comment"
					multiline
					rows={4}
					className="w-full"
					variant="outlined"
					placeholder="Type your feedback here..."
					required
					onChange={handleChange}
				/>
				<button
					type="submit"
					className="bg-blue-500 w-full text-2xl text-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Submit
				</button>
			</form>
		</div>
	);
}
