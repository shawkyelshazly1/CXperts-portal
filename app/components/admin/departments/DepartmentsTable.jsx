"use client";

import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import S from "underscore.string";

const columns = [
	{ field: "id", headerName: "ID", width: 100 },
	{
		field: "name",
		headerName: "Name",
		width: 300,
		valueGetter: (params) =>
			`${params.row.name
				.split("_")
				.map((word) => S(word).capitalize().value())
				.join(" ")}`,
	},

	{
		field: "parentDept",
		headerName: "ParentDepartment",
		width: 300,
		valueGetter: (params) =>
			`${
				S(params.row.parentDept?.name.split("_").join(" "))
					.capitalize()
					.value() || ""
			}`,
	},
	{ field: "description", headerName: "Description", width: 400 },
];

export default function DepartmentsTable() {
	const [departments, setDepartments] = useState([]);
	const [departmentsCount, setDepartmentsCount] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 10,
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function loadDepartmentsCount() {
			await fetch(`/api/admin/departments/departmentsCount`, { method: "GET" })
				.then(async (res) => {
					return await res.json();
				})
				.then((data) => {
					setDepartmentsCount(data);
				})
				.catch((error) => toast.error("Something went wrong!"));
		}

		// calling functions
		loadDepartmentsCount();
		return () => {
			setDepartmentsCount(0);
		};
	}, []);

	useEffect(() => {
		async function getDepartments() {
			setLoading(true);
			await fetch(
				`/api/admin/departments?skip=${
					paginationModel.page * paginationModel.pageSize
				}&take=${paginationModel.pageSize}`,
				{ method: "GET" }
			)
				.then(async (res) => {
					return await res.json();
				})
				.then((data) => {
					setDepartments(data);
				})
				.catch((error) => toast.error("Something went wrong!"))
				.finally(() => {
					setLoading(false);
				});
		}

		// calling functions
		getDepartments();
	}, [paginationModel.page]);

	return (
		<div className="w-full h-fit ">
			<DataGrid
				rows={departments}
				columns={columns}
				paginationModel={paginationModel}
				pagination
				paginationMode="server"
				onPaginationModelChange={setPaginationModel}
				pageSizeOptions={[10]}
				rowCount={departmentsCount}
				loading={loading}
			/>
		</div>
	);
}
