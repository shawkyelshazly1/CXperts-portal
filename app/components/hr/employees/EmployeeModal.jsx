"use client";

import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
import React, { forwardRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import EmployeeCard from "./EmployeeCard";
import EmployeeView from "./EmployeeView";
import EmployeeDocuments from "./EmployeeDocuments";
import { FaUserEdit } from "react-icons/fa";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function EmployeeModal({ employee }) {
	const [open, setOpen] = useState(false);

	console.log(employee);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<div className="relative group">
				<EmployeeCard employee={employee} openModal={handleClickOpen} />
				<div className="absolute h-full bg-green-300 top-0 right-0 rounded-r-3xl justify-center items-center flex px-4 text-white cursor-pointer opacity-0 group-hover:opacity-100">
					<FaUserEdit size={30} />
				</div>
			</div>

			<Dialog
				open={open}
				fullWidth={true}
				TransitionComponent={Transition}
				maxWidth={"xl"}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<div></div>
				<div className="flex flex-col  w-full items-center py-4 relative">
					<AiFillCloseCircle
						className="mr-6 text-gray-600 cursor-pointer  absolute top-2 right-0"
						size={30}
						onClick={() => {
							handleClose();
						}}
					/>
					<EmployeeView employee={employee} />

					<EmployeeDocuments employee={employee} />
				</div>
			</Dialog>
		</div>
	);
}
