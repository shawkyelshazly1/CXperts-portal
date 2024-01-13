"use client";

import { exportEmployeeDetailsToCSV } from "@/helpers/hr/employee";
import {
	Box,
	Checkbox,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Slide,
} from "@mui/material";
import { data } from "autoprefixer";
import React, { forwardRef, useState } from "react";
import toast from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const defaultFields = {
	employeeInfo: [
		{ name: "EmployeeID", value: "employeeId" },
		{ name: "Email Address", value: "email" },
		{ name: "First Name", value: "firstName" },
		{ name: "Last Name", value: "lastName" },
		{ name: "Date Of Birth", value: "birthDate" },
		{ name: "Phone Number", value: "phoneNumber" },
		{ name: "Nationality", value: "nationality" },
		{ name: "National ID", value: "nationalId" },
		{ name: "Department", value: "department" },
		{ name: "Project", value: "project" },
		{ name: "Position", value: "position" },
		{ name: "Manager", value: "manager" },
		{ name: "Account Status", value: "accountStatus" },
		{ name: "Resignation Date", value: "resignationDate" },
	],
	employeeDocuments: [
		{ name: "Medical Insurance Card", value: "medical_insurance_card" },
		{ name: "Criminal Record", value: "criminal_record" },
		{ name: "National ID Card", value: "national_id_card" },
		{ name: "Birth Certificate", value: "birth_certificate" },
		{ name: "Education Degree", value: "education_degree" },
		{ name: "Millitary Certificate", value: "millitary_certificate" },
		{ name: "Insurance Proof", value: "insurance_proof" },
		{ name: "Work Permit", value: "work_permit" },
		{ name: "Personal Photo", value: "personal_photo" },
	],
};

export default function ExtractModal({ employees }) {
	const [open, setOpen] = useState(false);

	const [selectedFields, setSelectedFields] = useState({
		employeeInfo: [
			"employeeId",
			"firstName",
			"lastName",
			"email",
			"department",
			"position",
			"manager",
		],
		employeeDocuments: [],
	});

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	// handle parent field change
	const handleChange = (e) => {
		let allChecked = Object(defaultFields[e.target.name]).every((field) =>
			selectedFields[e.target.name].includes(field.value)
		);

		if (allChecked) {
			setSelectedFields({
				...selectedFields,
				[e.target.name]: [],
			});
		} else {
			setSelectedFields({
				...selectedFields,
				[e.target.name]: [
					...Object(defaultFields[e.target.name]).map((field) => field.value),
				],
			});
		}
	};

	// handle  field change
	const handleChangeField = (e) => {
		let parentName = e.target.getAttribute("data-parent");
		let itemName = e.target.name;

		let itemIndex = selectedFields[parentName].indexOf(itemName);

		if (itemIndex === -1) {
			setSelectedFields({
				...selectedFields,
				[parentName]: [...selectedFields[parentName], itemName],
			});
		} else {
			setSelectedFields({
				...selectedFields,
				[parentName]: [
					...selectedFields[parentName].filter((item) => item !== itemName),
				],
			});
		}
	};

	return (
		<div>
			<button
				onClick={handleClickOpen}
				className="text-lg font-semibold py-2 px-4 rounded-xl text-white bg-primary"
			>
				Export
			</button>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<div className="flex flex-row justify-between w-full items-center">
					{" "}
					<DialogTitle>Extract Options</DialogTitle>
					<div className="flex flex-row gap-3 items-center">
						<button
							onClick={() => {
								if (
									Object.values(selectedFields).every(
										(group) => group.length === 0
									)
								) {
									toast.error("Please select fields");
								} else {
									exportEmployeeDetailsToCSV(employees, selectedFields);
									toast.success("File Started Downloading...");
									handleClose();
								}
							}}
							className={`text-white bg-primary py-2 px-4 rounded-lg font-semibold ${
								Object.values(selectedFields).every(
									(group) => group.length === 0
								)
									? " bg-gray-300 cursor-not-allowed"
									: " first-letter:"
							} `}
							disabled={Object.values(selectedFields).every(
								(group) => group.length === 0
							)}
						>
							Export
						</button>
						<AiFillCloseCircle
							className="mr-6 text-gray-600 cursor-pointer"
							size={25}
							onClick={() => {
								handleClose();
							}}
						/>
					</div>
				</div>

				<DialogContent>
					<div className="flex flex-row">
						<div>
							<FormControlLabel
								label="Employee Info"
								control={
									<Checkbox
										name="employeeInfo"
										checked={Object(defaultFields["employeeInfo"]).every(
											(field) =>
												selectedFields["employeeInfo"].includes(field.value)
										)}
										indeterminate={
											!Object(defaultFields["employeeInfo"]).every((field) =>
												selectedFields["employeeInfo"].includes(field.value)
											)
										}
										onChange={handleChange}
									/>
								}
							/>
							<Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
								{defaultFields["employeeInfo"].map((field, idx) => (
									<FormControlLabel
										label={field.name}
										key={idx}
										control={
											<Checkbox
												name={field.value}
												inputProps={{
													"data-parent": "employeeInfo",
												}}
												checked={selectedFields["employeeInfo"].includes(
													field.value
												)}
												onChange={handleChangeField}
											/>
										}
									/>
								))}
							</Box>
						</div>
						<div>
							<FormControlLabel
								label="Employee Documents"
								control={
									<Checkbox
										name="employeeDocuments"
										checked={Object(defaultFields["employeeDocuments"]).every(
											(field) =>
												selectedFields["employeeDocuments"].includes(
													field.value
												)
										)}
										indeterminate={
											!Object(defaultFields["employeeDocuments"]).every(
												(field) =>
													selectedFields["employeeDocuments"].includes(
														field.value
													)
											)
										}
										onChange={handleChange}
									/>
								}
							/>
							<Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
								{defaultFields["employeeDocuments"].map((field, idx) => (
									<FormControlLabel
										label={field.name}
										key={idx}
										control={
											<Checkbox
												name={field.value}
												inputProps={{
													"data-parent": "employeeDocuments",
												}}
												checked={selectedFields["employeeDocuments"].includes(
													field.value
												)}
												onChange={handleChangeField}
											/>
										}
									/>
								))}
							</Box>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
