"use client";

import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
import React, { forwardRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import EmployeeCard from "./EmployeeCard";
import Image from "next/image";
import EmployeeViewAndEditForm from "./EmployeeViewAndEditForm";

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
				fullWidth={true}
				TransitionComponent={Transition}
				maxWidth={"xl"}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<div className="flex flex-row justify-between w-full items-center py-4 relative">
					<AiFillCloseCircle
						className="mr-6 text-gray-600 cursor-pointer  absolute top-2 right-0"
						size={30}
						onClick={() => {
							handleClose();
						}}
					/>
					<EmployeeViewAndEditForm employee={employee} />
				</div>
			</Dialog>
		</div>
	);
}
