import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import S from "underscore.string";

export default function PositionAutoComplete({
	handleFieldChange,
	departmentId,
}) {
	const [positions, setPositions] = useState([]);

	// load positions
	useEffect(() => {
		async function loadPositions() {
			await fetch(`/api/admin/users/positions/${departmentId}`, {
				method: "GET",
			})
				.then(async (res) => {
					return await res.json();
				})
				.then((data) => {
					data = data.map((item) => {
						return {
							label: item.title
								.split("_")
								.map((value) => S(value).capitalize().value())
								.join(" "),
							id: item.id,
						};
					});
					setPositions(data);
				})
				.catch((error) => {
					console.log(error);
					toast.error("Something went wrong!");
				});
		}

		// calling functions
		if (departmentId) {
			loadPositions();
		}

		return () => {
			setPositions([]);
		};
	}, [departmentId]);

	return departmentId === null || null ? (
		<></>
	) : (
		<Autocomplete
			id="positionId"
			name="positionId"
			options={positions}
			className="w-full"
			onChange={(e, value) => {
				handleFieldChange({ name: "positionId", value: value?.id || "" });
			}}
			sx={{ width: 300 }}
			renderInput={(params) => {
				return <TextField {...params} label="Position" required />;
			}}
		/>
	);
}
