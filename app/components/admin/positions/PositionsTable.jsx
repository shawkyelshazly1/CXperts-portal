"use client";

import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import S from "underscore.string";

const columns = [
	{ field: "id", headerName: "ID", width: 100 },
	{
		field: "title",
		headerName: "Title",
		width: 300,
		valueGetter: (params) =>
			`${params.row.title
				.split("_")
				.map((word) => S(word).capitalize().value())
				.join(" ")}`,
	},

	{
		field: "department",
		headerName: "Department",
		width: 300,
		valueGetter: (params) =>
			`${
				S(params.row.department?.name.split("_").join(" "))
					.capitalize()
					.value() || ""
			}`,
	},
	{ field: "level", headerName: "Level", width: 100 },
];

export default function PositionsTable() {
	const [positions, setPositions] = useState([]);
	const [positionsCount, setPositionsCount] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 10,
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function loadpositionsCount() {
			await fetch(`/api/admin/positions/positionsCount`, { method: "GET" })
				.then(async (res) => {
					return await res.json();
				})
				.then((data) => {
					setPositionsCount(data);
				})
				.catch((error) => toast.error("Something went wrong!"));
		}

		// calling functions
		loadpositionsCount();
		return () => {
			setPositionsCount(0);
		};
	}, []);

	useEffect(() => {
		async function getPositions() {
			setLoading(true);
			await fetch(
				`/api/admin/positions?skip=${
					paginationModel.page * paginationModel.pageSize
				}&take=${paginationModel.pageSize}`,
				{ method: "GET" }
			)
				.then(async (res) => {
					return await res.json();
				})
				.then((data) => {
					setPositions(data);
				})
				.catch((error) => toast.error("Something went wrong!"))
				.finally(() => {
					setLoading(false);
				});
		}

		// calling functions
		getPositions();
	}, [paginationModel.page]);

	return (
		<div className="w-full self-center min-h-[200px] h-fit ">
			<DataGrid
				rows={positions}
				columns={columns}
				paginationModel={paginationModel}
				pagination
				paginationMode="server"
				onPaginationModelChange={setPaginationModel}
				pageSizeOptions={[10]}
				rowCount={positionsCount}
				loading={loading}
			/>
		</div>
	);
}
