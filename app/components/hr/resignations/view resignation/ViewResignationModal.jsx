"use client";
import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";
import ResignationDetailsView from "./ResignationDetailsView";
import { ClipLoader } from "react-spinners";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ViewResignationModal({ resignationId }) {
	const [open, setOpen] = useState(false);
	const [resignation, setResignation] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		async function loadResignation() {
			if (!open) return;
			setLoading(true);
			try {
				if (!resignationId) {
					throw new Error("No resignation ID provided");
				}
				const response = await fetch(
					`/api/hr/resignation/load/view/${encodeURIComponent(resignationId)}`,
					{
						method: "GET",
					}
				);
				if (!response.ok) {
					throw new Error("Failed to load resignation data");
				}
				const data = await response.json();
				setResignation(data);
			} catch (error) {
				toast.error("Something went wrong!");
			} finally {
				setLoading(false);
			}
		}

		loadResignation();
	}, [open, resignationId]);

	return (
		<div>
			<button
				className=" bg-primary text-white py-2 px-4 rounded-xl font-semibold"
				onClick={handleClickOpen}
			>
				View
			</button>

			<Dialog
				open={open}
				TransitionComponent={Transition}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<div className="flex flex-row justify-between w-full items-center">
					{" "}
					<DialogTitle>Resignation</DialogTitle>
					<AiFillCloseCircle
						className="mr-6 text-gray-600 cursor-pointer"
						size={25}
						onClick={() => {
							handleClose();
						}}
					/>
				</div>

				<DialogContent>
					{loading ? (
						<div className="w-full h-full flex items-center justify-center">
							<ClipLoader color="#1770b8" size={100} />
						</div>
					) : (
						resignation && <ResignationDetailsView resignation={resignation} />
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
