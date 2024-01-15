"use client";

import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
import { forwardRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import ExtendLastWorkingDateForm from "./ExtendLastWorkingDateForm";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ExtendLastWorkingDateModal({ resignation }) {
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
				className="bg-purple-500 text-white py-2 px-6 rounded-lg font-medium "
				onClick={handleClickOpen}
			>
				Extend Last Working Date
			</button>

			<Dialog
				open={open}
				TransitionComponent={Transition}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<div className="flex flex-row justify-between w-full items-center gap-2">
					{" "}
					<DialogTitle>Extend Last Working Date</DialogTitle>
					<AiFillCloseCircle
						className="mr-6 text-gray-600 cursor-pointer"
						size={25}
						onClick={() => {
							handleClose();
						}}
					/>
				</div>

				<DialogContent>
					<ExtendLastWorkingDateForm resignation={resignation} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
