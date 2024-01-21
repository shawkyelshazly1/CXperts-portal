import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import S from "underscore.string";

export default function ManagerAutoComplete({
	handleFieldChange,
	departmentId,
	positionId,
	required,
}) {
	const [managers, setManagers] = useState([]);

	// load managers
	useEffect(() => {
		async function loadManagers() {
			await fetch(
				`/api/admin/users/departments/people?departmentId=${departmentId}&positionId=${positionId}`,
				{
					method: "GET",
				}
			)
				.then(async (res) => {
					return await res.json();
				})
				.then((data) => {
					data = data.map((item) => {
						return {
							label: `${S(item.firstName).capitalize().value()}  ${S(
								item.lastName
							)
								.capitalize()
								.value()}`,
							id: item.employeeId,
						};
					});
					setManagers(data);
				})
				.catch((error) => {
					console.error(error);
					toast.error("Something went wrong!");
				});
		}

		// calling functions
		// calling functions
		if (departmentId && positionId) {
			loadManagers();
		}

		return () => {
			setManagers([]);
		};
	}, [departmentId, positionId]);

	return departmentId === null || "" ? (
		<></>
	) : (
		<Autocomplete
			id="manager"
			name="manager"
			options={managers}
			className="w-full"
			onChange={(e, value) => {
				handleFieldChange("managerId", value?.id || "");
			}}
			sx={{ width: 300 }}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Direct Manager"
					required={required !== undefined}
				/>
			)}
		/>
	);
}
