"use client";
import { exportToCsv } from "@/helpers/hr/resignations";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFileExport } from "react-icons/fa";

export default function ExportResignationsButton() {
	const [requests, setRequests] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [positions, setPositions] = useState([]);
	const [resignationStatuses, setResignationStatuses] = useState([]);
	const [employeeId, setEmployeeId] = useState("");

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
		const paramsFrom = urlSearchParams.get("from") || "";
		const paramsTo = urlSearchParams.get("to") || "";
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

	async function loadResignations() {
		await fetch(
			`/api/hr/resignation/load/all/export?department=${departments.join(
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
				exportToCsv(data);
			})
			.catch((error) => {
				console.error(error);
				toast.error("Something went wrong!");
			});
	}

	const exportResignations = async () => {
		toast.promise(loadResignations(), {
			loading: "Exporting Resignations...",
			success: "Resignations exported successfully!",
			error: "Something went wrong!",
		});
	};

	return (
		<button
			onClick={exportResignations}
			className={`  bg-green-500 hover:bg-green-700
    self-end  text-white font-semibold py-2 px-4 flex flex-row gap-2 text-lg items-center justify-center rounded-lg `}
		>
			Export <FaFileExport className="rotate-90" size={20} />
		</button>
	);
}
