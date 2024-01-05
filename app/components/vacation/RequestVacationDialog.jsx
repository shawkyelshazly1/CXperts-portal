"use client";

import { useState, forwardRef } from "react";

import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import VacationRequestForm from "./VacationRequestForm";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function RequestVacationDialog() {
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<div>
				<button
					className="rounded-3xl py-2 text-xl px-4 bg-blue-500 text-white font-medium "
					onClick={handleClickOpen}
				>
					Request A Leave
				</button>
				<Dialog
					open={open}
					TransitionComponent={Transition}
					keepMounted
					onClose={handleClose}
					aria-describedby="alert-dialog-slide-description"
				>
					<DialogTitle>New Leave Request</DialogTitle>
					<DialogContent>
						<VacationRequestForm closeModal={handleClose} />
					</DialogContent>
				</Dialog>
			</div>
		</LocalizationProvider>
	);
}
