"use client";

import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
import React, { forwardRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import AddPositionForm from "./AddPositionForm";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddPositionModal() {
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
				className=" bg-primary text-white py-2 px-4 rounded-xl font-semibold"
				onClick={handleClickOpen}
			>
				NEW POSITION
			</button>

			<Dialog
				open={open}
				TransitionComponent={Transition}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<div className="flex flex-row justify-between w-full items-center">
					{" "}
					<DialogTitle>Add New Position</DialogTitle>
					<AiFillCloseCircle
						className="mr-6 text-gray-600 cursor-pointer"
						size={25}
						onClick={() => {
							handleClose();
						}}
					/>
				</div>

				<DialogContent>
					<AddPositionForm
						closeModal={handleClose}
						openModal={handleClickOpen}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
