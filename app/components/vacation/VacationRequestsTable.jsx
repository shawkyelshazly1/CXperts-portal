"use client";

import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import S from "underscore.string";

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
		valueGetter: (params) => moment(params.row.createdAt).format("DD/MM/YYYY"),
		headerAlign: "center",
		align: "center",
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

export default function VacationRequestsTable() {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(false);
	const [requestsCount, setRequestsCount] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 10,
	});

	// load the requests count
	useEffect(() => {
		async function loadUserVacationRequestsCount() {
			await fetch(`/api/vacation/requestsCount`, { method: "GET" })
				.then(async (res) => {
					return await res.json();
				})
				.then((data) => {
					setRequestsCount(data.count);
				})
				.catch((error) => toast.error("Something went wrong!"));
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
				`/api/vacation/load?skip=${
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
