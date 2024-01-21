import { ShoppingCartRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import moment from "moment";
import React from "react";
import toast from "react-hot-toast";
import S from "underscore.string";
export default function ResignationDetailsView({ resignation }) {
	const formatName = (firstName, lastName) => {
		return `${S(firstName).capitalize().value()} ${S(lastName)
			.capitalize()
			.value()}`;
	};

	const formatDepartmentPosition = (department, position) => {
		return `${position
			.split("_")
			.map((word) => S(word).capitalize().value())
			.join(" ")} - ${department
			.split("_")
			.map((word) => S(word).capitalize().value())
			.join(" ")}`;
	};

	// post request to claim resignation as HR
	const claimResignation = async () => {
		toast.promise(
			fetch("/api/hr/resignation/claim", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ resignationId: resignation?.id }),
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Failed to claim resignation");
					}
					return response.json();
				})
				.then(() => {
					window.location.href = `/hr/resignations/view/${resignation.id}`;
				}),

			{
				loading: "Claiming resignation...",
				success: "Resignation successfully claimed! Redirecting...",
				error: "Error claiming resignation ",
			}
		);
	};

	return (
		<div className="bg-white shadow overflow-hidden sm:rounded-lg">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between items-center">
				<div className="flex flex-col">
					<h3 className="text-lg leading-6 font-medium text-gray-900">
						Resignation Details
					</h3>
					<p className="mt-1 max-w-2xl  text-gray-500">
						Personal details and application.
					</p>
				</div>
				<span
					className={`text-white text-center text-base py-1 px-3 rounded-full font-semibold capitalize w-fit ${
						resignation.status === "pending"
							? "bg-amber-500"
							: resignation.status === "processing"
							? "bg-purple-500"
							: resignation.status === "recalled" ||
							  resignation.status === "retained"
							? "bg-green-500"
							: resignation.status === "completed"
							? "bg-red-500"
							: ""
					}`}
				>
					{S(resignation.status).capitalize().value()}
				</span>
			</div>
			<div className="border-t border-gray-200">
				<dl>
					<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className=" font-medium text-gray-500">Employee ID</dt>
						<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
							{S(resignation.employee.employeeId).capitalize().value()}
						</dd>
					</div>
					<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className=" font-medium text-gray-500">Full name</dt>
						<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
							{formatName(
								resignation.employee.firstName,
								resignation.employee.lastName
							)}
						</dd>
					</div>
					<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className=" font-medium text-gray-500">
							Department - Position
						</dt>
						<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
							{formatDepartmentPosition(
								resignation.employee.department.name,
								resignation.employee.position.title
							)}
						</dd>
					</div>
					<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className=" font-medium text-gray-500">Submission date</dt>
						<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
							{moment(resignation.submissionDate).format("DD-MMM-YYYY")}
						</dd>
					</div>
					<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className=" font-medium text-gray-500">Reason for leaving</dt>
						<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
							{resignation.reason
								.split("_")
								.map((word) => S(word).capitalize().value())
								.join(" ")}
						</dd>
					</div>
					<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className=" font-medium text-gray-500">Last Working Date</dt>
						<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
							{moment(resignation.lastWorkingDate).format("DD-MMM-YYYY")}
						</dd>
					</div>

					{resignation.hrAssigned && (
						<>
							<hr />
							<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
								<dt className=" font-medium text-gray-500">Assigned To</dt>
								<dd className="mt-1  text-gray-900 sm:mt-0 sm:col-span-2">
									{S(resignation.hrAssigned.firstName).capitalize().value() +
										" " +
										S(resignation.hrAssigned.lastName).capitalize().value()}
								</dd>
							</div>
						</>
					)}
				</dl>
			</div>
			<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
				<button
					onClick={() => {
						if (!resignation.hrAssigned && resignation.status === "pending") {
							claimResignation(resignation.id);
						} else {
							window.open(`/hr/resignations/view/${resignation.id}`, "_blank");
						}
					}}
					type="button"
					className="inline-flex justify-center w-full py-2 px-4 text-lg border border-transparent shadow-sm  font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					{resignation.status === "pending" && !resignation.hrAssigned
						? "Claim"
						: "View Full Details"}
				</button>
			</div>
		</div>
	);
}
