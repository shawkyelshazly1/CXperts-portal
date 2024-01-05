"use client";

import { downloadBulkFormatSheet } from "@/helpers/admin/user";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Slide,
} from "@mui/material";
import React, { forwardRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import FileUploadButton from "./FileUploadButton";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddBulkUsersModal() {
	const [open, setOpen] = useState(false);
	

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<button
				className=" bg-secondary text-white py-2 px-4 rounded-xl font-semibold"
				onClick={handleClickOpen}
			>
				ADD BULK
			</button>

			<Dialog
				open={open}
				TransitionComponent={Transition}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<div className="flex flex-row justify-between w-full items-center gap-2">
					{" "}
					<DialogTitle>Add Or Update Users</DialogTitle>
					<button
						className="bg-blue-400 text-white font-black py-2 px-4 rounded-lg"
						onClick={downloadBulkFormatSheet}
					>
						Download Template
					</button>
					<AiFillCloseCircle
						className="mr-6 text-gray-600 cursor-pointer"
						size={25}
						onClick={() => {
							handleClose();
						}}
					/>
				</div>

				<DialogContent>
					<div className="flex flex-col gap-6">
						<FileUploadButton closeModal={handleClose} />
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
