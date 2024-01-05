"use client";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import S from "underscore.string";

export default function VacationRequestForm({ closeModal }) {
	const { data } = useSession();

	const [date, setDate] = useState({ from: "", to: "" });

	const [vacationReason, setVacationReason] = useState("");

	const handleChange = (event) => {
		setVacationReason(event.target.value);
	};

	const handleFormSubmission = async (e) => {
		e.preventDefault();

		// validate data is present
		if (Object.values(date).some((value) => value === "")) {
			toast.error("Select dates!");
			return;
		} else if (vacationReason === "") {
			toast.error("Select leave type!");
			return;
		}

		// validate dates
		if (moment(date.to).diff(moment(date.from), "days") < 0) {
			toast.error("Please check dates!");
			return;
		}

		// send api request to submit the request
		await fetch("/api/vacation/submit", {
			method: "POST",
			body: JSON.stringify({
				reason: vacationReason,
				...date,
			}),
		})
			.then(async (res) => {
				return await res.json();
			})
			.then((data) => {
				if (data.error) {
					toast.error(data.error);
				} else {
					toast.success("Request Submitted.");
					closeModal();
				}
			})
			.catch((error) => toast.error("Something went wrong!"));
	};

	const vacationTypes = ["annual", "casual", "sick", "business_trip"];

	return (
		<form
			onSubmit={handleFormSubmission}
			className="flex flex-col gap-4 py-4  justify-center"
		>
			<Box sx={{ minWidth: 120 }}>
				<FormControl fullWidth required>
					<InputLabel id="vacation-reason-select-label">Leave Type</InputLabel>
					<Select
						labelId="vacation-reason-select-label"
						id="vacation-reason-select"
						value={vacationReason}
						label="vacationReason"
						onChange={handleChange}
					>
						{vacationTypes
							.filter(
								(vacationType) =>
									data?.user?.position.title !== "representative" ||
									vacationType === "annual" ||
									vacationType === "sick"
							)
							.map((vacationType, idx) => (
								<MenuItem value={vacationType.toLowerCase()} key={idx}>
									{vacationType
										.split("_")
										.map((word) => S(word).capitalize().value())
										.join(" ")}
								</MenuItem>
							))}
					</Select>
				</FormControl>
			</Box>
			<div className="flex flex-row items-center justify-between gap-8">
				<FormControl fullWidth required>
					<DatePicker
						label="From"
						shouldDisableDate={(date) => {
							if (vacationReason !== "annual") return false;
							const sevenDaysFromNow = moment().add(7, "days").startOf("day");
							return (
								data?.user?.position.title === "representative" &&
								date < sevenDaysFromNow
							);
						}}
						onChange={(value) => {
							setDate({ ...date, from: value.toISOString() });
						}}
						minDate={
							vacationReason === "annual" &&
							data?.user?.position.title === "representative"
								? moment().add(7, "days")
								: undefined
						}
					/>
				</FormControl>
				<FormControl fullWidth required>
					<DatePicker
						label="To"
						onChange={(value) => {
							setDate({ ...date, to: value.toISOString() });
						}}
						minDate={moment(date.from)}
						disabled={!date.from}
					/>
				</FormControl>
			</div>
			<button className="bg-blue-500 text-white font-medium text-lg py-2 px-8 mt-4 rounded-3xl w-fit self-center ">
				Submit Reqeust
			</button>
		</form>
	);
}
