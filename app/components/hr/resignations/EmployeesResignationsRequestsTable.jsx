"use client";

import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import S from "underscore.string";
import _ from "lodash";
import { usePathname, useSearchParams } from "next/navigation";
import ViewResignationModal from "./view resignation/ViewResignationModal";

export default function EmployeesResignationsRequestsTable() {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(false);
	const [requestsCount, setRequestsCount] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 8,
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
			headerName: "Submittion Date",
			width: 140,
			valueGetter: (params) =>
				moment(params.row.submissionDate).format("DD/MM/YYYY"),
			headerAlign: "center",
			align: "center",
		},
		{
			field: "employeeId",
			headerName: "Employee ID",
			width: 100,
			valueGetter: (params) =>
				params.row.employee.employeeId
					.split("_")
					.map((word) => S(word).capitalize().value())
					.join(" "),
			align: "center",
			headerAlign: "center",
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
			field: "department",
			headerName: "Department",
			width: 200,
			valueGetter: (params) =>
				params.row.employee.department.name
					.split("_")
					.map((word) => S(word).capitalize().value())
					.join(" "),
			align: "center",
			headerAlign: "center",
		},
		{
			field: "position",
			headerName: "Position",
			width: 140,
			valueGetter: (params) =>
				params.row.employee.position.title
					.split("_")
					.map((word) => S(word).capitalize().value())
					.join(" "),
			align: "center",
			headerAlign: "center",
		},
		{
			field: "reason",
			headerName: "Reason",
			width: 250,
			valueGetter: (params) =>
				params.row.reason
					.split("_")
					.map((word) => S(word).capitalize().value())
					.join(" "),
			align: "center",
			headerAlign: "center",
		},
		{
			field: "lastWorkingDate",
			headerName: "Last Working Date",
			width: 170,
			valueGetter: (params) =>
				moment(params.row.lastWorkingDate).format("DD/MM/YYYY"),
			align: "center",
			headerAlign: "center",
		},
		{
			field: "status",
			headerName: "Resignation Status",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				return (
					<span
						className={`text-white text-center text-base py-1 px-3 rounded-full font-semibold capitalize w-24  ${
							params.value === "pending"
								? "bg-amber-500"
								: params.values === "processing"
								? "bg-purple-500"
								: params.value === "recalled"
								? "bg-green-500"
								: params.value === "completed"
								? "bg-red-500"
								: ""
						}`}
					>
						{params.value}
					</span>
				);
			},
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				return <ViewResignationModal resignationId={params.row.id} />;
			},
		},
	];

	// load the requests count
	useEffect(() => {
		async function loadPendingResignationsCount() {
			await fetch(`/api/hr/resignation/load/pending/count`, { method: "GET" })
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
		loadPendingResignationsCount();
		return () => {
			setRequestsCount(0);
		};
	}, []);

	// load requests
	useEffect(() => {
		async function loadPendingResignations() {
			setLoading(true);
			await fetch(
				`/api/hr/resignation/load/pending?skip=${
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
		loadPendingResignations();

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
				pageSizeOptions={[8]}
				rowCount={requestsCount}
				loading={loading}
			/>
		</div>
	);
}
