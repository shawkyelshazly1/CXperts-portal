"use client";

import {
	Dialog,
	DialogContent,
	DialogTitle,
	MenuItem,
	Slide,
} from "@mui/material";
import { useState, forwardRef } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import LockResetIcon from "@mui/icons-material/LockReset";
import ResetPasswordForm from "./ResetPasswordForm";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ResetPasswordModal({ userId, closeMenu }) {
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		closeMenu();
	};
	return (
		<div>
			<MenuItem onClick={handleClickOpen} disableRipple>
				<LockResetIcon />
				Reset Password
			</MenuItem>

			<Dialog
				open={open}
				TransitionComponent={Transition}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<div className="flex flex-row justify-between w-full items-center">
					{" "}
					<DialogTitle>Reset User Password</DialogTitle>
					<AiFillCloseCircle
						className="mr-6 text-gray-600 cursor-pointer"
						size={25}
						onClick={() => {
							handleClose();
						}}
					/>
				</div>

				<DialogContent>
					<ResetPasswordForm userId={userId} closeModal={handleClose} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
