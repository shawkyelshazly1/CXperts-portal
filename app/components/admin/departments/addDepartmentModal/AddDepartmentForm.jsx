import { FormControl, TextField } from "@mui/material";
import { useState } from "react";
import DepartmentAutoComplete from "./formComponenets/DepartmentAutoComplete";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

export default function AddDepartmentForm({ closeModal, openModal }) {
	const [formData, setFormData] = useState({
		name: null,
		description: null,
		parentId: null,
	});

	const [loading, setLoading] = useState(false);

	const handleFieldChange = (field) => {
		setFormData({ ...formData, [field.name]: field.value });
	};

	const handleFormSubmission = async (e) => {
		e.preventDefault();

		if (formData.name === "") {
			toast.error("Please enter department name!");
			return;
		}

		setLoading(true);

		await fetch(`/api/admin/departments/create`, {
			method: "POST",
			body: JSON.stringify({
				...formData,
				name: formData.name.trim(),
			}),
		})
			.then(async (res) => {
				return await res.json();
			})
			.then((data) => {
				if (data.error) {
					throw new Error(data.error);
				}

				toast.success("Department Created");
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
					id="name"
					label="Name"
					variant="outlined"
					className="w-full"
					name="name"
					onChange={(e) => {
						handleFieldChange({ name: e.target.name, value: e.target.value });
					}}
				/>
			</FormControl>
			<FormControl>
				<TextField
					id="description"
					label="Description"
					multiline
					className="w-full"
					name="description"
					rows={4}
					variant="outlined"
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
