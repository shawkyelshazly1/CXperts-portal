"use client";

import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
import React, { forwardRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import EmployeeCard from "./EmployeeCard";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function EmployeeModal({ employee }) {
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<EmployeeCard employee={employee} openModal={handleClickOpen} />

			<Dialog
				open={open}
				TransitionComponent={Transition}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<div className="flex flex-row justify-between w-full items-center">
					{" "}
					<DialogTitle>Add New User</DialogTitle>
					<AiFillCloseCircle
						className="mr-6 text-gray-600 cursor-pointer"
						size={25}
						onClick={() => {
							handleClose();
						}}
					/>
				</div>

				<DialogContent>test </DialogContent>
			</Dialog>
		</div>
	);
}
