"use client";

import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import S from "underscore.string";
import _ from "lodash";
import { usePathname, useSearchParams } from "next/navigation";

export default function AgentsVacationRequestsTable() {
	const [requests, setRequests] = useState([]);
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingApprovalAction, setLoadingApprovalAction] = useState(false);
	const [requestsCount, setRequestsCount] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 8,
	});

	const searchParams = useSearchParams();

	useEffect(() => {
		// Only run this code on the client-side

		if (typeof window === "undefined") {
			return;
		}

		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = urlSearchParams.get("department")?.split(",") || [];

		if (!_.isEqual(projects, params)) {
			setProjects(urlSearchParams?.get("department")?.split(",") || []);
		}
		// Now, we use the setProjects state updater function
	}, [searchParams]);

	// columns for the table
	const columns = [
		{
			field: "id",
			headerName: "ID",
			width: 70,
			align: "center",
			headerAlign: "center",
		},
		{
			field: "createdAt",
			headerName: "Submit Date",
			width: 140,
			valueGetter: (params) =>
				moment(params.row.createdAt).format("DD/MM/YYYY"),
			headerAlign: "center",
			align: "center",
		},

		{
			field: "employee",
			headerName: "Employee Name",
			width: 200,
			valueGetter: (params) =>
				`${params.row.employee.firstName} ${params.row.employee.lastName}`,
			align: "center",
			headerAlign: "center",
		},
		{
			field: "reason",
			headerName: "Vacation Type",
			width: 200,
			valueGetter: (params) =>
				params.row.reason
					.split("_")
					.map((word) => S(word).capitalize().value())
					.join(" "),
			align: "center",
			headerAlign: "center",
		},
		{
			field: "from",
			headerName: "From",
			width: 140,
			valueGetter: (params) => moment(params.row.from).format("DD/MM/YYYY"),
			align: "center",
			headerAlign: "center",
		},
		{
			field: "to",
			headerName: "To",
			width: 140,
			valueGetter: (params) => moment(params.row.to).format("DD/MM/YYYY"),
			align: "center",
			headerAlign: "center",
		},
		{
			field: "days",
			headerName: "Days",
			width: 100,
			valueGetter: (params) =>
				moment(params.row.to).diff(moment(params.row.from), "days") + 1,
			align: "center",
			headerAlign: "center",
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 250,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				return (
					<div className="flex flex-row items-center justify-center gap-2">
						{loadingApprovalAction ? (
							<ClipLoader color="#1770b8" size={20} />
						) : (
							<>
								<span
									onClick={() => {
										changeRequestStatus(
											params.row.id,
											"approved",
											parseInt(
												moment(params.row.to).diff(
													moment(params.row.from),
													"days"
												) + 1
											)
										);
									}}
									className="cursor-pointer text-white text-center bg-green-500 hover:bg-green-600 text-base py-1 px-3 rounded-full font-semibold capitalize w-24"
								>
									Approve
								</span>

								<span
									className="cursor-pointer text-white text-center bg-red-500 hover:bg-red-600  text-base py-1 px-3 rounded-full font-semibold capitalize w-24"
									onClick={() => {
										changeRequestStatus(
											params.row.id,
											"denied",
											parseInt(
												moment(params.row.to).diff(
													moment(params.row.from),
													"days"
												) + 1
											)
										);
									}}
								>
									Deny
								</span>
							</>
						)}
					</div>
				);
			},
		},
	];

	// update request status
	const changeRequestStatus = async (requestId, status, days) => {
		setLoadingApprovalAction(true);
		await fetch(`/api/vacation/approval/wfm`, {
			method: "POST",
			body: JSON.stringify({
				requestId,
				status,
				days,
			}),
		})
			.then(async (res) => {
				return await res.json();
			})
			.then((data) => {
				if (data.error) {
					throw new Error(data.error);
				}
				toast
					.promise(sendRequestFeedbackEmail(requestId, status), {
						loading: "Updating Request Status...",
						success: "Vacation Request Updated!",
						error: "Failed to update status!, please refresh page to confirm.",
					})
					.then(() => {
						// remove request from the data
						let updatedRequests = requests.filter(
							(request) => parseInt(request.id) !== parseInt(requestId)
						);
						setRequests(updatedRequests);
						return;
					});

				// remove request from the data
				let updatedRequests = requests.filter(
					(request) => parseInt(request.id) !== parseInt(requestId)
				);
				setRequests(updatedRequests);
			})
			.catch((error) => {
				toast.error(error.message);
			})
			.finally(() => {
				setLoadingApprovalAction(false);
			});
	};

	//Send request feedback email
	const sendRequestFeedbackEmail = async (requestId, status) => {
		// send api request to send welcome emails to new employees
		await fetch("/api/vacation/send-request-feedback-email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				requestId,
				status,
			}),
		})
			.then(async (res) => {
				if (!res.ok) {
					throw new Error("Failed to send Request feedback email.");
				}
				return await res.json();
			})
			.catch((error) => {
				toast.error(error.message);
			});
	};

	// load the requests count
	useEffect(() => {
		async function loadProjectVacationRequestsCount() {
			await fetch(
				`/api/vacation/load/wfm/count?project=${projects.join(",")}`,
				{ method: "GET" }
			)
				.then(async (res) => {
					return await res.json();
				})
				.then((data) => {
					setRequestsCount(data.count);
				})
				.catch((error) => {
					toast.error("Something went wrong!");
				});
		}

		// calling functions
		loadProjectVacationRequestsCount();
		return () => {
			setRequestsCount(0);
		};
	}, [projects]);

	// load requests
	useEffect(() => {
		async function loadProjectRequests() {
			setLoading(true);
			await fetch(
				`/api/vacation/load/wfm?skip=${
					paginationModel.page * paginationModel.pageSize
				}&take=${paginationModel.pageSize}&project=${projects.join(",")}`,
				{ method: "GET" }
			)
				.then(async (res) => {
					return await res.json();
				})
				.then((data) => {
					setRequests(data);
				})
				.catch((error) => toast.error("Something went wrong!"))
				.finally(() => {
					setLoading(false);
				});
		}

		// calling functions
		loadProjectRequests();

		return () => {
			setRequests([]);
		};
	}, [paginationModel.page, projects]);

	return (
		<div className="w-full lg:w-fit max-h-full min-h-[200px] self-center text-center">
			<DataGrid
				rows={requests}
				columns={columns}
				paginationModel={paginationModel}
				pagination
				paginationMode="server"
				onPaginationModelChange={setPaginationModel}
				pageSizeOptions={[8]}
				rowCount={requestsCount}
				loading={loading}
			/>
		</div>
	);
}
