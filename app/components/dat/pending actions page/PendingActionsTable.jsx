"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Button,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";

import S from "underscore.string";
import moment from "moment";
import ViewActionModal from "./ViewActionModal";

export default function PendingActionsTable() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await axios.get("/api/dat/actions/pending_approval");
				setData(response.data);
			} catch (error) {
				console.error("Error fetching data: ", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="p-4">
			<TableContainer component={Paper} className="shadow-md">
				<Table className="min-w-full">
					<TableHead>
						<TableRow>
							<TableCell>Action ID</TableCell>
							<TableCell>Submission Date</TableCell>
							<TableCell>Employee ID</TableCell>
							<TableCell>Employee</TableCell>
							<TableCell>Incident Date</TableCell>
							<TableCell>Action Category</TableCell>
							<TableCell>Action Type</TableCell>
							<TableCell>Submitted By</TableCell>

							<TableCell align="right">Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((row, index) => (
							<TableRow key={index}>
								<TableCell>{row.id}</TableCell>
								<TableCell>
									{moment(row.submissionDate).format("DD MMM YYYY")}
								</TableCell>
								<TableCell>{row.actionedEmployee?.employeeId}</TableCell>
								<TableCell>
									{S(row.actionedEmployee?.firstName).capitalize().value() +
										" " +
										S(row.actionedEmployee?.lastName).capitalize().value()}
								</TableCell>
								<TableCell>
									{moment(row.incidentDate).format("DD MMM YYYY")}
								</TableCell>
								<TableCell>
									{row.actionCategory
										.split("_")
										.map((word) => S(word).capitalize().value())
										.join(" ")}
								</TableCell>
								<TableCell>{row.actionType}</TableCell>
								<TableCell>
									{" "}
									{S(row.submittedBy?.firstName).capitalize().value() +
										" " +
										S(row.submittedBy?.lastName).capitalize().value()}
								</TableCell>

								<TableCell align="right">
									<ViewActionModal action={row} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			{loading && (
				<div className="flex justify-center items-center mt-4">
					<CircularProgress />
				</div>
			)}
		</div>
	);
}
