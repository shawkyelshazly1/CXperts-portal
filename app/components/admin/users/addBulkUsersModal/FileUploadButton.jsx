import Button from "@mui/joy/Button";
import SvgIcon from "@mui/joy/SvgIcon";
import React, { useState } from "react";
import { styled } from "@mui/joy";
import { SiMicrosoftexcel } from "react-icons/si";
import { AiFillCloseCircle } from "react-icons/ai";
import { exportWFRToCsv, validateBulkTemplate } from "@/helpers/admin/user";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useData } from "app/contexts/admin/UserPageContext";

// style for hidden input file upload
const VisuallyHiddenInput = styled("input")`
	clip: rect(0 0 0 0);
	clip-path: inset(50%);
	height: 1px;
	overflow: hidden;
	position: absolute;
	bottom: 0;
	left: 0;
	white-space: nowrap;
	width: 1px;
`;

export default function FileUploadButton({ closeModal }) {
	const [selectedFile, setSelectedFile] = useState(null);
	const [loadingStatus, setLoadingStatus] = useState(false);

	// load data from Provider
	const { data, setData } = useData();

	// handle the input file change
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setSelectedFile(file);
	};

	// function to send data file to server
	const upsertUsers = async (data) => {
		setLoadingStatus(true);
		await fetch("/api/admin/users/upsert_bulk", {
			method: "POST",
			body: JSON.stringify({
				...data,
			}),
		})
			.then(async (res) => {
				return await res.json();
			})
			.then((data) => {
				if (data.error) {
					throw new Error(data.error);
				}
				toast.success("Operation Completed.");

				// setting results in provider
				setData(data);

				exportWFRToCsv(data.wfrs);

				// close modal & open results modal
				closeModal();
				document.getElementById("bulk_users_results_modal").click();
			})
			.catch((error) => {
				toast.error(error.message);
			})
			.finally(() => {
				// reset status values
				setSelectedFile(null);
				setLoadingStatus(false);
			});
	};

	// handling uploading file & validation
	const handleUpload = () => {
		// You can add your file upload logic here, such as sending the file to a server.
		if (selectedFile) {
			// Validate template columns
			validateBulkTemplate(selectedFile).then((result) => {
				// if no result show alert
				if (!result) {
					alert("Please Adhere To Template!");
					setSelectedFile(null);
					return;
				} else {
					// validate data exists in file
					if (result.length === 0) {
						alert("Empty File!");
						setSelectedFile(null);
						return;
					}
				}

				// send request with data
				upsertUsers(result);
			});
		} else {
			alert("Please select a file to upload.");
		}
	};

	return loadingStatus ? (
		<ClipLoader color="#2263b3" className="block m-auto" size={40} />
	) : selectedFile !== null ? (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row justify-between">
				<h1 className="flex flex-row gap-1">
					<SiMicrosoftexcel />
					{selectedFile.name}
				</h1>
				<AiFillCloseCircle
					className="mr-6 text-gray-600 cursor-pointer"
					size={25}
					onClick={() => {
						setSelectedFile(null);
					}}
				/>
			</div>
			<button
				onClick={handleUpload}
				className="bg-green-500 text-white text-lg w-fit py-2 px-4 self-center rounded-lg font-semibold"
			>
				Add Or Update
			</button>
		</div>
	) : (
		<Button
			component="label"
			role={undefined}
			tabIndex={-1}
			variant="outlined"
			color="neutral"
			startDecorator={
				<SvgIcon>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
						/>
					</svg>
				</SvgIcon>
			}
		>
			<h1 className="text-lg font-semibold">Upload a file</h1>
			<VisuallyHiddenInput
				onChange={(e) => {
					handleFileChange(e);
				}}
				type="file"
				accept=".xlsx, .xls, .csv"
			/>
		</Button>
	);
}
