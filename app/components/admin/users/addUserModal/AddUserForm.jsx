"use client";

import { TextField, FormControl } from "@mui/material";
import { useState } from "react";
import DepartmentAutoComplete from "./formComponents/DepartmentAutoComplete";
import ManagerAutoComplete from "./formComponents/ManagerAutoComplete";
import PositionAutoComplete from "./formComponents/PositionAutoComplete";
import toast from "react-hot-toast";
import { exportWFRToCsv } from "@/helpers/admin/user";
import { ClipLoader } from "react-spinners";

export default function AddUserForm({ closeModal, openModal }) {
	const [formData, setFormData] = useState({
		firstName: null,
		lastName: null,
		email: null,
		departmentId: null,
		positionId: null,
		projectId: null,
	});

	const [loading, setLoading] = useState(false);

	const handleFormSubmission = async (e) => {
		e.preventDefault();

		if (
			Object.entries(formData).some(
				(key, value) => value === null && key !== "projectId"
			)
		) {
			toast.error("Missing User Info!");
			return;
		}
		setLoading(true);
		// send api request to CREATE USER
		await fetch("/api/admin/users/create", {
			method: "POST",
			body: JSON.stringify({
				...formData,
			}),
		})
			.then(async (res) => {
				return await res.json();
			})
			.then((data) => {
				if (data.error) {
					throw new Error(data.error);
				}
				exportWFRToCsv(data);
				toast.success("User Created");
				closeModal();
			})
			.catch((error) => {
				toast.error(error.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleFieldChange = (field) => {
		setFormData({ ...formData, [field.name]: field.value });
	};

	return (
		<form
			onSubmit={handleFormSubmission}
			className="flex flex-col gap-4 w-full"
		>
			<div className="flex flex-col lg:w-full items-center lg:flex-row gap-2 mt-4">
				<TextField
					required
					id="firstName"
					label="First Name"
					variant="outlined"
					className="w-full"
					name="firstName"
					onChange={(e) => {
						handleFieldChange({ name: e.target.name, value: e.target.value });
					}}
				/>
				<TextField
					required
					id="lastName"
					label="Last Name"
					variant="outlined"
					name="lastName"
					className="w-full"
					onChange={(e) => {
						handleFieldChange({ name: e.target.name, value: e.target.value });
					}}
				/>
			</div>
			<FormControl>
				<TextField
					required
					id="email"
					label="Email"
					type="email"
					variant="outlined"
					name="email"
					className="w-full"
					onChange={(e) => {
						handleFieldChange({ name: e.target.name, value: e.target.value });
					}}
				/>
			</FormControl>
			<DepartmentAutoComplete handleFieldChange={handleFieldChange} />
			<FormControl className="flex flex-col  lg:flex-row gap-2">
				<PositionAutoComplete
					handleFieldChange={handleFieldChange}
					departmentId={formData.departmentId}
				/>
				<ManagerAutoComplete
					handleFieldChange={handleFieldChange}
					departmentId={formData.departmentId}
					positionId={formData.positionId}
				/>
			</FormControl>

			<div className="flex flex-row gap-3 items-center self-center">
				<button
					disabled={loading}
					type="submit"
					className="py-2 px-3 rounded-lg bg-green-400 text-white font-semibold text-xl"
				>
					{loading ? <ClipLoader size={25} color="#FFF" /> : "Submit"}
				</button>
				<button
					type="reset"
					onClick={() => {
						closeModal();
						var delayInMilliseconds = 250; //1 second

						setTimeout(function () {
							openModal();
						}, delayInMilliseconds);
					}}
					className="py-2 px-5 rounded-lg bg-red-400 text-white font-semibold text-xl"
				>
					Reset
				</button>
			</div>
		</form>
	);
}
