"use client";

import { Autocomplete, FormControl, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import S from "underscore.string";

export default function DepartmentAutoComplete({ handleFieldChange }) {
	const [departments, setDepartments] = useState([]);
	const [subDepartments, setSubDepartments] = useState([]);
	const [selectedDepartment, setSelectedDepartment] = useState(null);
	const [selectedSubDepartment, setSelectedSubDepartment] = useState(null);

	// load departments
	useEffect(() => {
		async function loadDepartments() {
			await fetch(`/api/admin/users/departments`, { method: "GET" })
				.then(async (res) => {
					return await res.json();
				})
				.then((data) => {
					data = data.map((item) => {
						return {
							label: item.name
								.split("_")
								.map((value) => S(value).capitalize().value())
								.join(" "),
							id: item.id,
						};
					});
					setDepartments(data);
				})
				.catch((error) => toast.error("Something went wrong!"));
		}

		// calling functions
		loadDepartments();

		return () => {
			setDepartments([]);
			setSelectedDepartment(null);
		};
	}, []);

	// load Sub departments
	useEffect(() => {
		async function loadSubDepartments() {
			await fetch(`/api/admin/users/departments/${selectedDepartment?.id}`, {
				method: "GET",
			})
				.then(async (res) => {
					return await res.json();
				})
				.then((data) => {
					data = data.map((item) => {
						return {
							label: item.name
								.split("_")
								.map((value) => S(value).capitalize().value())
								.join(" "),
							id: item.id,
						};
					});
					setSubDepartments(data);
				})
				.catch((error) => toast.error("Something went wrong!"));
		}

		// calling functions
		if (selectedDepartment) loadSubDepartments();

		return () => {
			setSubDepartments([]);
		};
	}, [selectedDepartment]);

	return (
		<FormControl className="flex flex-col  lg:flex-row gap-2">
			<Autocomplete
				name="departmentId"
				id="departmentId"
				className="w-full"
				options={departments}
				onChange={(e, value) => {
					handleFieldChange({ name: "departmentId", value: value?.id || "" });
					setSelectedDepartment(value);
				}}
				sx={{ width: 300 }}
				renderInput={(params) => (
					<TextField {...params} label="Department" required />
				)}
			/>
			{subDepartments.length <= 0 ? (
				<></>
			) : (
				<Autocomplete
					id="subDepartment"
					name="subDepartment"
					options={subDepartments}
					className="w-full"
					onChange={(e, value) => {
						handleFieldChange({ name: "projectId", value: value?.id || "" });
						setSelectedSubDepartment(value);
					}}
					sx={{ width: 300 }}
					renderInput={(params) => (
						<TextField {...params} label="Project" required />
					)}
				/>
			)}
		</FormControl>
	);
}
