import { Button } from "@mui/material";
import moment from "moment";
import toast from "react-hot-toast";
import S from "underscore.string";

export default function ActionDetailsView({ action, closeModal }) {
	const formatName = (firstName, lastName) => {
		return `${S(firstName).capitalize().value()} ${S(lastName)
			.capitalize()
			.value()}`;
	};

	const handleApprove = () => {
		toast.promise(
			fetch("/api/dat/action/approve", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ actionId: action.id }),
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error("Failed to approve action");
					}
					return res.json();
				})
				.then(() => {
					closeModal();
					setTimeout(() => window.location.reload(), 1500);
				}),
			{
				loading: "Approving action...",
				success: "Action approved successfully!",
				error: "Error approving action",
			}
		);
	};

	const handleReject = () => {
		toast.promise(
			fetch("/api/dat/action/reject", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ actionId: action.id }),
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error("Failed to reject action");
					}
					return res.json();
				})
				.then(() => {
					closeModal();
					setTimeout(() => window.location.reload(), 1500);
				}),
			{
				loading: "Rejecting action...",
				success: "Action rejected successfully!",
				error: "Error rejecting action",
			}
		);
	};
	return (
		<div className="bg-white shadow overflow-hidden sm:rounded-lg">
			<div className="border-t border-gray-200">
				<dl>
					<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className=" font-medium text-gray-500">Submission date</dt>
						<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
							{moment(action.submissionDate).format("DD-MMM-YYYY")}
						</dd>
					</div>
					<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className=" font-medium text-gray-500">Employee ID</dt>
						<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
							{S(action.actionedEmployee.employeeId).capitalize().value()}
						</dd>
					</div>
					<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className=" font-medium text-gray-500">Full name</dt>
						<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
							{formatName(
								action.actionedEmployee.firstName,
								action.actionedEmployee.lastName
							)}
						</dd>
					</div>
					<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className=" font-medium text-gray-500">Incident date</dt>
						<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
							{moment(action.incidentDate).format("DD-MMM-YYYY")}
						</dd>
					</div>
					<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className=" font-medium text-gray-500">Action Category</dt>
						<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
							{action.actionCategory
								.split("_")
								.map((word) => S(word).capitalize().value())
								.join(" ")}
						</dd>
					</div>
					<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className=" font-medium text-gray-500">Action Type</dt>
						<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
							{action.actionType}
						</dd>
					</div>
					<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className=" font-medium text-gray-500">Comment</dt>
						<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
							{action.comment}
						</dd>
					</div>
					<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className=" font-medium text-gray-500">Submitted By</dt>
						<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
							{formatName(
								action.submittedBy.firstName,
								action.submittedBy.lastName
							)}
						</dd>
					</div>
				</dl>
			</div>

			<div className="px-4 py-3 bg-gray-50 text-center sm:px-6 ">
				<Button
					variant="contained"
					color="primary"
					className="mr-4 bg-primary text-white font-semibold"
					onClick={handleApprove}
				>
					Approve
				</Button>
				<Button
					variant="contained"
					color="error"
					onClick={handleReject}
					className="bg-red-600 text-white font-semibold"
				>
					Reject
				</Button>
			</div>
		</div>
	);
}
