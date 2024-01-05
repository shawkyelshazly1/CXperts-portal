"use client";

import { downloadBulkFormatSheet } from "@/helpers/admin/user";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Slide,
} from "@mui/material";
import React, { forwardRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Results from "./Results";
import { useData } from "app/contexts/admin/UserPageContext";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddBulkUsersResultsModal() {
	const [open, setOpen] = useState(false);

	// data context
	const { setData } = useData();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setData(null);
		setOpen(false);
	};

	return (
		<div>
			<button
				id="bulk_users_results_modal"
				className=" bg-secondary text-white py-2 px-4 rounded-xl font-semibold hidden"
				onClick={handleClickOpen}
			>
				Bulk Results
			</button>

			<Dialog
				open={open}
				TransitionComponent={Transition}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<div className="flex flex-row justify-between w-full items-center gap-2">
					{" "}
					<DialogTitle>Operation Results</DialogTitle>
					<AiFillCloseCircle
						className="mr-6 text-gray-600 cursor-pointer"
						size={25}
						onClick={() => {
							handleClose();
						}}
					/>
				</div>

				<DialogContent>
					<div className="flex flex-col gap-6">
						<Results />
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
