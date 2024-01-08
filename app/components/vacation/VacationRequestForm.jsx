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
import { IoMdCloseCircle } from "react-icons/io";
import { SvgIcon } from "@mui/material";
import { MdPictureAsPdf } from "react-icons/md";

export default function VacationRequestForm({ closeModal }) {
	const { data: userData } = useSession();

	const [date, setDate] = useState({ from: "", to: "" });

	const [vacationReason, setVacationReason] = useState("");
	const [file, setFile] = useState(null);

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

		// validate sick note available
		if (vacationReason === "sick" && file === null) {
			toast.error("Please upload a sick note!");
			return;
		}

		let formData = new FormData();
		formData.append("file", file);
		formData.append("reason", vacationReason);
		formData.append("from", date.from);
		formData.append("to", date.to);

		// send api request to submit the request
		await fetch("/api/vacation/submit", {
			method: "POST",
			body: formData,
		})
			.then(async (res) => {
				return await res.json();
			})
			.then((data) => {
				if (data.error) {
					toast.error(data.error);
				} else {
					toast
						.promise(
							sendRequestSubmissionEmail(
								vacationReason,
								userData?.user?.email,
								date
							),
							{
								loading: "Submitting your request...",
								success: "Request submitted successfully!",
								error:
									"Something went wrong! Refresh the page to confirm the submission.",
							}
						)
						.then(async () => {
							if (vacationReason !== "sick") {
								await sendRequestManagerEmail(
									vacationReason,
									date,
									userData?.user?.manager?.email,
									S(userData?.user?.employeeId).capitalize().value(),
									S(userData?.user?.firstName).capitalize().value() +
										" " +
										S(userData?.user?.lastName).capitalize().value()
								);
							}
						});
					closeModal();
				}
			})
			.catch((error) => toast.error("Something went wrong!"));
	};

	const vacationTypes = ["annual", "casual", "sick", "business_trip"];

	//Send request email
	const sendRequestSubmissionEmail = async (vacationReason, email, date) => {
		// send api request to send welcome emails to new employees
		await fetch("/api/vacation/send-request-email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				vacationType: vacationReason,
				from: date.from,
				to: date.to,
				email: email,
			}),
		})
			.then(async (res) => {
				if (!res.ok) {
					throw new Error("Failed to send Request email.");
				}
				return await res.json();
			})
			.catch((error) => {
				toast.error(error.message);
			});
	};

	//Send request email
	const sendRequestManagerEmail = async (
		vacationReason,
		date,
		email,
		employeeId,
		employeeName
	) => {
		// send api request to send welcome emails to new employees
		await fetch("/api/vacation/send-manager-email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				vacationType: vacationReason,
				from: date.from,
				to: date.to,
				email: email,
				employeeId,
				employeeName,
			}),
		})
			.then(async (res) => {
				if (!res.ok) {
					throw new Error("Failed to send Request email to Manager.");
				}
				return await res.json();
			})
			.catch((error) => {
				toast.error(error.message);
			});
	};

	const getMinDate = () => {
		const today = moment();

		const isRepresentative =
			userData?.user?.position.title === "representative";
		const isBeforeFriday = today.isoWeekday() < 5;

		const weeksToAdd = isBeforeFriday ? 2 : 3;

		const nextApplicableMonday = today
			.clone()
			.add(weeksToAdd, "weeks")
			.startOf("isoWeek");

		return isRepresentative && date < nextApplicableMonday;
	};

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
									userData?.user?.position.title !== "representative" ||
									vacationType === "annual"
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
							const today = moment();

							const isRepresentative =
								userData?.user?.position.title === "representative";
							const isBeforeFriday = today.isoWeekday() < 5;

							const weeksToAdd = isBeforeFriday ? 2 : 3;

							const nextApplicableMonday = today
								.clone()
								.add(weeksToAdd, "weeks")
								.startOf("isoWeek");

							return isRepresentative && date < nextApplicableMonday;
						}}
						onChange={(value) => {
							setDate({ ...date, from: value.toISOString() });
						}}
						minDate={getMinDate()}
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
			<Box sx={{ minWidth: 120 }}>
				{vacationReason === "sick" && (
					<label>
						<input
							type="file"
							accept="image/*,application/pdf"
							hidden
							onChange={({ target }) => {
								if (target.files) {
									let file = target?.files?.[0];
									if (
										file &&
										(file.type === "application/pdf" ||
											file.type.startsWith("image/"))
									) {
										setFile(file);
									} else {
										toast.error("Please upload a valid image or PDF file.");
									}
								}
							}}
						/>
						<div className="w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
							{file ? (
								<div className="relative w-full h-full flex items-center justify-center">
									{file &&
										(file.type.startsWith("image/") ? (
											<img
												src={URL.createObjectURL(file)}
												alt="sick note"
												className="w-full h-full object-contain"
											/>
										) : (
											file.type === "application/pdf" && (
												<div className="flex items-center space-x-2 justify-center break-words overflow-wrap w-full">
													<SvgIcon component={MdPictureAsPdf} color="error" />
													<span className="truncate text-sm overflow-wrap break-words">
														{file.name}
													</span>
												</div>
											)
										))}
									<IoMdCloseCircle
										className="absolute top-0 right-0 cursor-pointer"
										size={30}
										color="red"
										onClick={(e) => {
											e.stopPropagation();
											setFile(null);
										}}
									/>
								</div>
							) : (
								<span>Upload Sick Note</span>
							)}
						</div>
					</label>
				)}
			</Box>
			<button className="bg-blue-500 text-white font-medium text-lg py-2 px-8 mt-4 rounded-3xl w-fit self-center ">
				Submit Reqeust
			</button>
		</form>
	);
}
