"use client";

import { Dialog, Slide } from "@mui/material";
import { forwardRef, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import EmployeeEditForm from "./EmployeeEditForm";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
export default function EmployeeEditModal({ employee }) {
	const [open, setOpen] = useState(true);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<div>
			<div
				className="absolute h-full bg-green-300 top-0 right-0 rounded-r-3xl justify-center items-center flex px-4 text-white cursor-pointer opacity-0 group-hover:opacity-100"
				onClick={handleClickOpen}
			>
				<FaUserEdit size={30} />
			</div>

			<Dialog
				open={open}
				fullWidth={true}
				TransitionComponent={Transition}
				maxWidth={"xl"}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<EmployeeEditForm employee={employee} closeModal={handleClose} />
			</Dialog>
		</div>
	);
}
