"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import S from "underscore.string";
import { ClipLoader } from "react-spinners";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";
import moment from "moment"; // ...
export default function EmployeeActionHistory({ employeeId }) {
	const [actionsHistory, setActionsHistory] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const loadActionsHistory = async () => {
			setLoading(true);
			try {
				const response = await fetch("/api/dat/actions/history", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ employeeId }),
				});
				if (!response.ok) {
					throw new Error("Failed to fetch actions history");
				}
				const data = await response.json();
				console.log(data);
				setActionsHistory(data);
			} catch (error) {
				console.error(error?.message);
				toast.error(error?.message);
			} finally {
				setLoading(false);
			}
		};

		loadActionsHistory();
	}, [employeeId]);

	return (
		<div className="w-full flex flex-col">
			<h1 className="text-lg font-semibold text-gray-500">Actions History</h1>
			{/* Display of action categories and their actions */}
			{loading ? (
				<div className="flex flex-col items-center justify-center w-full ">
					<ClipLoader color="#1770b8" size={100} />
				</div>
			) : (
				<div className="space-y-4">
					{Object.entries(actionsHistory).map(([category, details]) => (
						<Accordion key={category}>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<h2 className="text-xl font-bold text-gray-700 my-auto">
									{S(category)
										.split("_")
										.map((word) => S(word).capitalize().value())
										.join(" ")}
								</h2>
								<h2 className=" font-bold text-gray-500 ml-4 my-auto">
									Count: {details.count}
								</h2>
							</AccordionSummary>
							<AccordionDetails className="bg-white shadow-md rounded-lg p-4">
								<TableContainer component={Paper} className="mt-4">
									<Table aria-label="action details table">
										<TableHead>
											<TableRow>
												<TableCell>Submission Date</TableCell>
												<TableCell>Incident Date</TableCell>
												<TableCell>Type</TableCell>
												<TableCell>Submitted By</TableCell>
												<TableCell>Comment</TableCell>
												<TableCell>Requires Approval</TableCell>
												<TableCell>Approval Status</TableCell>
												<TableCell>Approved By</TableCell>
												<TableCell>Approved On</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{details.actions.map((action, idx) => (
												<TableRow key={idx}>
													<TableCell>
														{moment(action.submissionDate).format("MM/DD/yyyy")}
													</TableCell>

													<TableCell>
														{moment(action.incidentDate).format("MM/DD/yyyy")}
													</TableCell>
													<TableCell>{action.actionType}</TableCell>
													<TableCell>{`${action.submittedBy.firstName} ${action.submittedBy.lastName}`}</TableCell>
													<TableCell>
														{S(action.comment).truncate(200).value()}
													</TableCell>
													<TableCell>
														{action.requiresApproval ? "Yes" : "No"}
													</TableCell>
													<TableCell>{action.approvalStatus || ""}</TableCell>
													<TableCell>
														{action.approvedBy?.firstName
															? `${action.approvedBy.firstName} ${action.approvedBy.lastName}`
															: ""}
													</TableCell>
													<TableCell>
														{action.approvedOn
															? moment(action.approvedOn).format("MM/DD/yyyy")
															: ""}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</AccordionDetails>
						</Accordion>
					))}
				</div>
			)}
		</div>
	);
}
