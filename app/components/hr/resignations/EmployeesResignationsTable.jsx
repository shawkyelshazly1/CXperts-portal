"use client";

import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import S from "underscore.string";
import _ from "lodash";
import { usePathname, useSearchParams } from "next/navigation";
import ResignationDetailsView from "./view resignation/ResignationDetailsView";
import ViewResignationModal from "./view resignation/ViewResignationModal";

export default function EmployeesResignationsTable() {
	const [requests, setRequests] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [positions, setPositions] = useState([]);
	const [resignationStatuses, setResignationStatuses] = useState([]);
	const [employeeId, setEmployeeId] = useState("");
	const [loading, setLoading] = useState(false);
	const [requestsCount, setRequestsCount] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 5,
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

		const paramsPositions = urlSearchParams.get("position")?.split(",") || [];
		const paramsResignationStatuses =
			urlSearchParams.get("resignationStatus")?.split(",") || [];

		const paramsEmployeeId = urlSearchParams.get("employeeId") || "";

		if (!_.isEqual(departments, paramsDepartments)) {
			setDepartments(urlSearchParams?.get("department")?.split(",") || []);
		}
		if (!_.isEqual(resignationStatuses, paramsResignationStatuses)) {
			setResignationStatuses(
				urlSearchParams?.get("resignationStatus")?.split(",") || []
			);
		}

		if (!_.isEqual(positions, paramsPositions)) {
			setPositions(urlSearchParams?.get("position")?.split(",") || []);
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
				`${S(params.row.employee.firstName).capitalize().value()} ${S(
					params.row.employee.lastName
				)
					.capitalize()
					.value()}`,
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
			field: "hrAssigned",
			headerName: "Assigned To",
			width: 170,
			valueGetter: (params) => {
				if (params.row.hrAssigned) {
					return `${S(params.row.hrAssigned.firstName)
						.capitalize()
						.value()} ${S(params.row.hrAssigned.lastName)
						.capitalize()
						.value()}`;
				} else {
					return "-";
				}
			},
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
						className={`text-white text-center text-base py-1 px-3 rounded-full font-semibold capitalize w-fit ${
							params.value === "pending"
								? "bg-amber-500"
								: params.value === "processing"
								? "bg-purple-500"
								: params.value === "recalled" || params.value === "retained"
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
			field: "view",
			headerName: "View",
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
		async function loadProjectVacationRequestsCount() {
			await fetch(
				`/api/hr/resignation/load/all/count?department=${departments.join(
					","
				)}&position=${positions.join(
					","
				)}&employeeId=${employeeId}&resignationStatus=${resignationStatuses.join(
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
	}, [departments, positions, employeeId, resignationStatuses]);

	// load requests
	useEffect(() => {
		async function loadProjectRequests() {
			setLoading(true);
			await fetch(
				`/api/hr/resignation/load/all?skip=${
					paginationModel.page * paginationModel.pageSize
				}&take=${paginationModel.pageSize}&department=${departments.join(
					","
				)}&position=${positions.join(
					","
				)}&employeeId=${employeeId}&resignationStatus=${resignationStatuses.join(
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
		positions,
		employeeId,
		resignationStatuses,
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
				pageSizeOptions={[5]}
				rowCount={requestsCount}
				loading={loading}
			/>
		</div>
	);
}
