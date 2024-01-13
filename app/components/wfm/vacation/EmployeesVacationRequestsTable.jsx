"use client";

import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import S from "underscore.string";
import _ from "lodash";
import { usePathname, useSearchParams } from "next/navigation";

export default function EmployeesVacationRequestsTable() {
	const [requests, setRequests] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [approvalStatuses, setApprovalStatuses] = useState([]);
	const [employeeId, setEmployeeId] = useState("");
	const [loading, setLoading] = useState(false);
	const [requestsCount, setRequestsCount] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 10,
	});

	const searchParams = useSearchParams();

	useEffect(() => {
		// Only run this code on the client-side

		if (typeof window === "undefined") {
			return;
		}

		const urlSearchParams = new URLSearchParams(window.location.search);

		const paramsDepartments =
			urlSearchParams.get("department")?.split(",") || [];

		const paramsApprovalStatus =
			urlSearchParams.get("approvalStatus")?.split(",") || [];

		const paramsFrom = urlSearchParams.get("from") || "";
		const paramsTo = urlSearchParams.get("to") || "";
		const paramsEmployeeId = urlSearchParams.get("employeeId") || "";

		if (!_.isEqual(departments, paramsDepartments)) {
			setDepartments(urlSearchParams?.get("department")?.split(",") || []);
		}
		if (!_.isEqual(approvalStatuses, paramsApprovalStatus)) {
			setApprovalStatuses(
				urlSearchParams?.get("approvalStatus")?.split(",") || []
			);
		}

		if (!_.isEqual(from, paramsFrom)) {
			setFrom(urlSearchParams?.get("from") || "");
		}

		if (!_.isEqual(to, paramsTo)) {
			setTo(urlSearchParams?.get("to") || "");
		}

		if (!_.isEqual(employeeId, paramsEmployeeId)) {
			setEmployeeId(urlSearchParams?.get("employeeId") || "");
		}

		// Now, we use the setDepartments state updater function
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
			field: "approvalStatus",
			headerName: "Status",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				return (
					<span
						className={`text-white text-center text-base py-1 px-3 rounded-full font-semibold capitalize w-24  ${
							params.value === "pending"
								? "bg-amber-500"
								: params.value === "approved"
								? "bg-green-500"
								: "bg-red-500"
						}`}
					>
						{params.value}
					</span>
				);
			},
		},
	];

	// load the requests count
	useEffect(() => {
		async function loadProjectVacationRequestsCount() {
			await fetch(
				`/api/vacation/load/wfm/all/count?department=${departments.join(
					","
				)}&from=${from}&to=${to}&employeeId=${employeeId}&approvalStatus=${approvalStatuses.join(
					","
				)}`,
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
	}, [departments, from, to, employeeId, approvalStatuses]);

	// load requests
	useEffect(() => {
		async function loadProjectRequests() {
			setLoading(true);
			await fetch(
				`/api/vacation/load/wfm/all?skip=${
					paginationModel.page * paginationModel.pageSize
				}&take=${paginationModel.pageSize}&department=${departments.join(
					","
				)}&from=${from}&to=${to}&employeeId=${employeeId}&approvalStatus=${approvalStatuses.join(
					","
				)}`,
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
	}, [
		paginationModel.page,
		departments,
		from,
		to,
		employeeId,
		approvalStatuses,
	]);

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
