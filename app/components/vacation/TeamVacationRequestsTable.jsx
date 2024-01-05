"use client";

import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import S from "underscore.string";

export default function TeamVacationRequestsTable() {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingApprovalAction, setLoadingApprovalAction] = useState(false);
	const [requestsCount, setRequestsCount] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 10,
	});

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
		await fetch(`/api/vacation/approval`, {
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
				toast.success("Vacation Request Updated.");
				// remove request from the data
				let updatedRequests = requests.filter(
					(request) => parseInt(request.id) !== parseInt(requestId)
				);
				setRequests(updatedRequests);
				return;
			})
			.catch((error) => {
				toast.error(error.message);
			})
			.finally(() => {
				setLoadingApprovalAction(false);
			});
	};

	// load the requests count
	useEffect(() => {
		async function loadUserVacationRequestsCount() {
			await fetch(`/api/vacation/load/team/count`, { method: "GET" })
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
		loadUserVacationRequestsCount();
		return () => {
			setRequestsCount(0);
		};
	}, []);

	// load requests
	useEffect(() => {
		async function loadRequests() {
			setLoading(true);
			await fetch(
				`/api/vacation/load/team?skip=${
					paginationModel.page * paginationModel.pageSize
				}&take=${paginationModel.pageSize}`,
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
		loadRequests();

		return () => {
			setRequests([]);
		};
	}, [paginationModel.page]);

	return (
		<div className="w-full lg:w-fit max-h-full min-h-[200px] self-center text-center">
			<DataGrid
				rows={requests}
				columns={columns}
				paginationModel={paginationModel}
				pagination
				paginationMode="server"
				onPaginationModelChange={setPaginationModel}
				pageSizeOptions={[10]}
				rowCount={requestsCount}
				loading={loading}
			/>
		</div>
	);
}
