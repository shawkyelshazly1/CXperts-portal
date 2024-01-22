"use client";

import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
import { forwardRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import ExtractHistoryForm from "./ExtractHistoryForm";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
export default function ExtractDataModal() {
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
				Extract DAT History
			</button>

			<Dialog
				open={open}
				TransitionComponent={Transition}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<div className="flex flex-row justify-between w-full items-center">
					{" "}
					<DialogTitle>Extract DAT History</DialogTitle>
					<AiFillCloseCircle
						className="mr-6 text-gray-600 cursor-pointer"
						size={25}
						onClick={() => {
							handleClose();
						}}
					/>
				</div>

				<DialogContent>
					<ExtractHistoryForm />
				</DialogContent>
			</Dialog>
		</div>
	);
}
