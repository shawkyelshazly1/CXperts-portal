"use client";

import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
import React, { forwardRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import EmployeeCard from "./EmployeeCard";
import EmployeeView from "./EmployeeView";
import EmployeeDocuments from "./EmployeeDocuments";
import { FaUserEdit } from "react-icons/fa";
import EmployeeEditModal from "./EmployeeEditModal";

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
			<div className="relative group">
				<EmployeeCard employee={employee} openModal={handleClickOpen} />
				<EmployeeEditModal employee={employee} />
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
