import { TextField, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ExtendLastWorkingDateForm({ resignation }) {
	const [selectedDate, setSelectedDate] = useState(
		moment(resignation?.lastWorkingDate)
	);

	const minDate =
		resignation?.employee?.position?.title === "representative"
			? moment().add(14, "days")
			: moment().add(30, "days");

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	const handleFormSubmission = async (e) => {
		e.preventDefault();

		if (!selectedDate) {
			toast.error("Please select a date");
			return;
		}

		const today = moment();
		const minimumDays =
			resignation?.employee?.position?.title === "representative" ? 14 : 30;
		const selectedDayMeetsRequirement = selectedDate.isAfter(
			today.add(minimumDays - 1, "days"),
			"day"
		);

		if (!selectedDayMeetsRequirement) {
			const errorMessage = `Selected date must be at least ${minimumDays} days from today.`;
			toast.error(errorMessage);
			return;
		}

		toast.promise(
			fetch("/api/user/resignation/extend_last_working_date", {
				method: "POST",
				body: JSON.stringify({
					resignationId: resignation?.id,
					lastWorkingDate: selectedDate.toISOString(),
				}),
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error("Failed to update last working date.");
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
				loading: "Updating resignation last working date...",
				success:
					"Updated resignation last working date successfully! Refreshing page...",
				error: "Failed to update resignation last working date.",
			}
		);
	};

	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<form className="flex flex-col gap-4" onSubmit={handleFormSubmission}>
				<DatePicker
					disablePast
					minDate={minDate}
					value={selectedDate}
					onChange={handleDateChange}
					inputFormat="MM/DD/YYYY"
					slotProps={{
						textField: {
							required: true,
							name: "lastWorkingDate",
						},
					}}
				/>
				<Button
					variant="contained"
					type="submit"
					color="primary"
					className="bg-purple-500 text-white py-2 px-6 rounded-lg font-medium"
				>
					Update Last Working Date
				</Button>
			</form>
		</LocalizationProvider>
	);
}
