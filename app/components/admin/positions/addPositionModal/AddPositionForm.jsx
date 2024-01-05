import { FormControl, TextField } from "@mui/material";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import DepartmentAutoComplete from "./formComponenets/DepartmentAutoComplete";
import toast from "react-hot-toast";

export default function AddPositionForm({ closeModal, openModal }) {
	const [formData, setFormData] = useState({
		title: null,
		departmentId: null,
		level: null,
	});

	const [loading, setLoading] = useState(false);

	const handleFieldChange = (field) => {
		setFormData({ ...formData, [field.name]: field.value });
	};

	const handleFormSubmission = async (e) => {
		e.preventDefault();

		if (
			Object.values(formData).some((value) => value === null || value === "")
		) {
			toast.error("Please enter valid position details.");
			return;
		}

		if (formData.level <= 0) {
			toast.error("Please enter a valid level!");
			return;
		}

		setLoading(true);

		await fetch(`/api/admin/positions/create`, {
			method: "POST",
			body: JSON.stringify({
				...formData,
				title: formData.title.trim(),
				level: parseInt(formData.level),
			}),
		})
			.then(async (res) => {
				return await res.json();
			})
			.then((data) => {
				if (data.error) {
					throw new Error(data.error);
				}

				toast.success("Position Created.");
				closeModal();
			})
			.catch((error) => {
				toast.error(error.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<form
			className="flex flex-col gap-4 w-full"
			onSubmit={handleFormSubmission}
		>
			<FormControl>
				<TextField
					required
					id="title"
					label="Title"
					variant="outlined"
					className="w-full"
					name="title"
					onChange={(e) => {
						handleFieldChange({ name: e.target.name, value: e.target.value });
					}}
				/>
			</FormControl>
			<FormControl>
				<TextField
					required
					id="level"
					type="number"
					label="Level"
					variant="outlined"
					className="w-full"
					InputProps={{
						inputProps: {
							min: 1,
							step: 1,
						},
					}}
					name="level"
					fullWidth
					onChange={(e) => {
						handleFieldChange({ name: e.target.name, value: e.target.value });
					}}
				/>
			</FormControl>

			<FormControl>
				<DepartmentAutoComplete handleFieldChange={handleFieldChange} />
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
