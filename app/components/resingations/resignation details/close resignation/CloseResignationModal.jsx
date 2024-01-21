"use client";

import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
import { forwardRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { TbTicketOff } from "react-icons/tb";
import CloseResignationForm from "./CloseResignationForm";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
export default function CloseResignationModal({ resignationId }) {
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
				className=" bg-secondary/90 text-white py-2 px-4 rounded-xl font-semibold flex flex-row items-center gap-1 hover:bg-secondary"
				onClick={handleClickOpen}
			>
				<TbTicketOff size={23} /> Close Resignation
			</button>

			<Dialog
				open={open}
				TransitionComponent={Transition}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<div className="flex flex-row justify-between w-full items-center">
					{" "}
					<DialogTitle>Close Resignation</DialogTitle>
					<AiFillCloseCircle
						className="mr-6 text-gray-600 cursor-pointer"
						size={25}
						onClick={() => {
							handleClose();
						}}
					/>
				</div>

				<DialogContent>
					<CloseResignationForm resignationId={resignationId} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
