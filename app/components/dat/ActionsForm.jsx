"use client";
import { useEffect, useRef, useState } from "react";
import { Autocomplete, Button, TextField, Alert } from "@mui/material";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

const actionCategories = [
	{ label: "Lateness", value: "lateness" },
	{ label: "Exceeding Breaks", value: "exceeding_breaks" },
	{ label: "No Show With Call", value: "no_show_with_call" },
	{ label: "No Show Without Call", value: "no_show_without_call" },
	{ label: "Attendance Manipulation", value: "attendance_manipulation" },
	{ label: "Early Leave", value: "early_leave" },
	{ label: "Personal Attitude", value: "personal_attitude" },
	{ label: "Company Assets", value: "company_assets" },
	{ label: "Routing Calls", value: "routing_calls" },
	{ label: "Releasing Calls", value: "releasing_calls" },
	{ label: "Aux Abusing", value: "aux_abusing" },
	{ label: "Smoking Inside", value: "smoking_inside" },
];

export default function ActionsForm({ employee }) {
	const [formData, setFormData] = useState({
		actionCategory: "",
		incidentDate: "",
		comment: "",
		nextAction: null,
		pendingApproval: false,
	});

	const autocompleteRef = useRef(null);

	const initialFormState = {
		actionCategory: "",
		incidentDate: "",
		comment: "",
		nextAction: null,
		pendingApproval: false,
	};

	const [loading, setLoading] = useState(false);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		if (name === "incidentDate" && value === "") {
			setFormData({
				...formData,
				nextAction: null,
				pendingApproval: false,
				[name]: value,
			});
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const validateFormData = (formData) => {
		if (!formData.actionCategory) {
			toast.error("Please select an action category.");
			return false;
		}
		if (!formData.incidentDate) {
			toast.error("Please enter an incident date.");
			return false;
		}
		if (!formData.comment || formData.comment.trim() === "") {
			toast.error("Please enter a comment.");
			return false;
		}

		// validate is date isn't greater than today
		if (new Date(formData.incidentDate) > new Date()) {
			toast.error("Incident date cannot be greater than today.");
			return false;
		}

		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		// Assuming you have a utility function to validate the form data
		const isValid = validateFormData(formData);
		if (!isValid) {
			return;
		}
		try {
			const response = await fetch("/api/dat/actions/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					employeeId: employee.employeeId,
				}),
			});
			const data = await response.json();
			if (data?.error) {
				toast.error(data?.error?.message);
				return;
			} else {
				toast.success("Action submitted successfully!");
				const ele = autocompleteRef.current.getElementsByClassName(
					"MuiAutocomplete-clearIndicator"
				)[0];
				if (ele) ele.click();
				setFormData({
					actionCategory: "",
					incidentDate: "",
					comment: "",
					nextAction: null,
					pendingApproval: false,
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const fetchNextApplicableAction = async () => {
			if (formData.actionCategory && formData.incidentDate) {
				setLoading(true);
				try {
					const response = await fetch(`/api/dat/actions/next`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							actionCategory: formData.actionCategory,
							incidentDate: formData.incidentDate,
							employeeId: employee.employeeId,
						}),
					});
					const data = await response.json();

					setFormData((prevFormData) => ({
						...prevFormData,
						nextAction: data.nextAction,
						pendingApproval: data.pendingApproval,
					}));
				} catch (error) {
					console.error(error);
				} finally {
					setLoading(false);
				}
			}
		};

		fetchNextApplicableAction();
	}, [formData.actionCategory, formData.incidentDate]);

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 xl:w-[30%] lg:w-[40%]  w-1/2 items-center justify-center flex-col gap-1"
		>
			{formData.pendingApproval && (
				<Alert severity="warning" className="font-semibold text-base">
					There is a pending approval action.
				</Alert>
			)}

			<Autocomplete
				ref={autocompleteRef}
				options={actionCategories}
				getOptionLabel={(option) => option.label}
				renderInput={(params) => (
					<TextField {...params} label="Action Category" />
				)}
				onChange={(event, value) => {
					setFormData({ ...formData, actionCategory: value?.value || "" });

					if (value === null) {
						setFormData({
							...formData,
							nextAction: null,
							pendingApproval: false,
						});
					}
				}}
			/>

			<TextField
				label="Incident Date"
				type="date"
				InputLabelProps={{
					shrink: true,
				}}
				onChange={handleInputChange}
				value={formData.incidentDate}
				name="incidentDate"
				className="w-full"
				inputProps={{
					max: new Date().toISOString().split("T")[0],
				}}
			/>

			{loading ? (
				<div className="w-full items-center justify-center flex">
					<ClipLoader color="#1770b8" size={100} />
				</div>
			) : (
				formData.nextAction &&
				!formData.pendingApproval && (
					<>
						<Alert severity="info">
							Next applicable action:{" "}
							<span className="font-semibold text-xl capitalize">
								{formData.nextAction}
							</span>
						</Alert>
						<TextField
							label="Comment"
							multiline
							rows={4}
							name="comment"
							onChange={handleInputChange}
							value={formData.comment}
							className="w-full"
							required
						/>
						<div className="flex flex-row gap-2   w-full items-center justify-center">
							<button
								className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
								type="button"
								onClick={() => {
									const ele = autocompleteRef.current.getElementsByClassName(
										"MuiAutocomplete-clearIndicator"
									)[0];
									if (ele) ele.click();
									setFormData(initialFormState);
								}}
							>
								Reset
							</button>
							<button
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
								type="submit"
							>
								Submit
							</button>
						</div>
					</>
				)
			)}
		</form>
	);
}
