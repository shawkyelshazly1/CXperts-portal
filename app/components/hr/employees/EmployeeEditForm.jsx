"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import {
	FaCloudUploadAlt,
	FaEdit,
	FaFileUpload,
	FaUpload,
} from "react-icons/fa";

export default function EmployeeEditForm({ employee, closeModal }) {
	const [employeeInfo, setEmployeeInfo] = useState({});
	const [files, setFiles] = useState([]);

	const isTextField = (name) =>
		["email", "firstName", "lastName", "nationality"].includes(name);

	const handleChange = (e) => {
		const { name, value } = e.target;
		const newValue = isTextField(name) ? value.toLowerCase().trim() : value;
		const employeeValue = isTextField(name)
			? employee[name]?.toLowerCase().trim()
			: employee[name];

		if (newValue !== employeeValue && newValue !== "") {
			setEmployeeInfo((prevState) => ({
				...prevState,
				[name]: newValue,
			}));
		} else {
			setEmployeeInfo((prevState) => {
				const newState = { ...prevState };
				delete newState[name];
				return newState;
			});
		}
	};

	const handleFileSelection = (file, documentName) => {
		setFiles((prevState) => [...prevState, { file, documentName }]);
	};

	const handleFileRemove = (documentName) => {
		setFiles((prevState) =>
			prevState.filter((file) => file.documentName !== documentName)
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (Object.keys(employeeInfo).length === 0 && files.length === 0) {
			toast.error("No changes made");
			return;
		}

		const formData = new FormData();
		for (const file of Array.from(files)) {
			formData.append(`${file.documentName}`, file.file);
		}
		formData.append("employeeId", employee.employeeId);
		formData.append("employeeInfo", JSON.stringify(employeeInfo));

		toast.promise(
			fetch(`/api/hr/employee/update`, {
				method: "POST",
				body: formData,
			}).then((res) => {
				if (!res.ok) {
					throw new Error("Failed to update employee");
				}
				return res.json();
			}),
			{
				loading: "Updating employee...",
				success: (data) => {
					closeModal();
					return "Employee updated successfully";
				},
				error: (err) => {
					return err.message;
				},
			}
		);
	};

	return (
		<div className="flex flex-col p-4">
			<h1 className="text-4xl font-semibold ">Edit Employee</h1>
			<form onSubmit={handleSubmit}>
				<div className="flex justify-end space-x-4">
					<button
						type="submit"
						className="bg-green-500 hover:bg-green-600 text-2xl font-semibold text-white rounded px-4 py-2"
					>
						Update
					</button>
					<button
						type="button"
						className="bg-red-500 hover:bg-red-600 text-2xl font-semibold text-white rounded px-4 py-2"
						onClick={closeModal}
					>
						Cancel
					</button>
				</div>
				<h1 className="text-2xl font-semibold text-gray-400 mb-3">
					Employee Info
				</h1>

				<div className="grid grid-cols-2 gap-4">
					<label className="block">
						<span className="text-gray-700">Employee ID</span>
						<input
							name="employeeId"
							className="mt-1 block w-full border p-2 rounded"
							type="text"
							placeholder="Employee ID"
							defaultValue={employee.employeeId}
							onChange={handleChange}
						/>
					</label>
					<label className="block">
						<span className="text-gray-700">First Name</span>
						<input
							name="firstName"
							className="mt-1 block w-full border p-2 rounded"
							type="text"
							placeholder="First Name"
							defaultValue={employee.firstName}
							onChange={handleChange}
						/>
					</label>
					<label className="block">
						<span className="text-gray-700">Middle Name</span>
						<input
							name="middleName"
							className="mt-1 block w-full border p-2 rounded"
							type="text"
							placeholder="Middle Name"
							defaultValue={employee.middleName}
							onChange={handleChange}
						/>
					</label>
					<label className="block">
						<span className="text-gray-700">Last Name</span>
						<input
							name="lastName"
							className="mt-1 block w-full border p-2 rounded"
							type="text"
							placeholder="Last Name"
							defaultValue={employee.lastName}
							onChange={handleChange}
						/>
					</label>
					<label className="block">
						<span className="text-gray-700">Email</span>
						<input
							name="email"
							className="mt-1 block w-full border p-2 rounded"
							type="email"
							placeholder="Email"
							defaultValue={employee.email}
							onChange={handleChange}
						/>
					</label>
					<label className="block">
						<span className="text-gray-700">Date of Birth</span>
						<input
							name="birthDate"
							className="mt-1 block w-full border p-2 rounded"
							type="date"
							placeholder="Date of Birth"
							defaultValue={employee.birthDate}
							onChange={handleChange}
						/>
					</label>
					<label className="block">
						<span className="text-gray-700">Hiring Date</span>
						<input
							name="hiringDate"
							className="mt-1 block w-full border p-2 rounded"
							type="date"
							placeholder="Hiring Date"
							defaultValue={employee.hiringDate}
							onChange={handleChange}
						/>
					</label>
					<label className="block">
						<span className="text-gray-700">Phone Number</span>
						<input
							name="phoneNumber"
							className="mt-1 block w-full border p-2 rounded"
							type="number"
							placeholder="Phone Number"
							defaultValue={employee.phoneNumber}
							onChange={handleChange}
						/>
					</label>
					<label className="block">
						<span className="text-gray-700">Nationality</span>
						<input
							name="nationality"
							className="mt-1 block w-full border p-2 rounded"
							type="text"
							placeholder="Nationality"
							defaultValue={employee.nationality}
							onChange={handleChange}
						/>
					</label>
					<label className="block">
						<span className="text-gray-700">National ID</span>
						<input
							name="nationalId"
							className="mt-1 block w-full border p-2 rounded"
							type="number"
							placeholder="National ID"
							defaultValue={employee.nationalId}
							onChange={handleChange}
						/>
					</label>
				</div>
				<hr className="my-6" />
				<h1 className="text-2xl font-semibold text-gray-400 mt-3">
					Employee Documents
				</h1>
				<div className="flex flex-row flex-wrap -mx-2">
					{Object.entries(employee.documents || {})
						.filter(
							([key]) => !["id", "employeeid"].includes(key.toLowerCase())
						)
						.map(([key, value], index) => (
							<div key={index} className="w-1/2 p-2">
								<div className="flex flex-row items-center justify-between border p-4 rounded">
									<h1 className="font-semibold">
										{key
											.split("_")
											.map(
												(part) => part.charAt(0).toUpperCase() + part.slice(1)
											)
											.join(" ")}
									</h1>
									<div>
										{files.find((doc) => doc.documentName === key) ? (
											<div className="flex flex-row gap-1 items-center">
												<img
													src={URL.createObjectURL(
														files.find((doc) => doc.documentName === key).file
													)}
													alt={`Thumbnail of ${key}`}
													className="w-10 h-10 object-cover"
												/>
												<button
													onClick={() => handleFileRemove(key)}
													className="bg-transparent border-none cursor-pointer"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6 text-red-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M6 18L18 6M6 6l12 12"
														/>
													</svg>
												</button>
											</div>
										) : value ? (
											<div className="flex flex-row gap-1">
												<a
													href={value}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-500 hover:text-blue-700 underline"
												>
													View Document
												</a>
												<span className="mx-1">|</span>
												<label
													htmlFor={`upload-${key}`}
													className="cursor-pointer flex flex-row items-center justify-center underline text-gray-500"
												>
													<input
														accept="image/*"
														type="file"
														multiple={false}
														className="hidden"
														id={`upload-${key}`}
														onChange={(e) => {
															handleFileSelection(e.target.files[0], key);
														}}
													/>
													<FaEdit />
													<p>Change Document</p>
												</label>
											</div>
										) : (
											<label
												htmlFor={`upload-${key}`}
												className="cursor-pointer flex flex-row items-center justify-center underline text-gray-500"
											>
												<input
													accept="image/*"
													type="file"
													multiple={false}
													className="hidden"
													id={`upload-${key}`}
													onChange={(e) => {
														handleFileSelection(e.target.files[0], key);
													}}
												/>
												<FaCloudUploadAlt />
												<span className="text-gray-500">Upload</span>
											</label>
										)}
									</div>
								</div>
							</div>
						))}
				</div>
			</form>
		</div>
	);
}
