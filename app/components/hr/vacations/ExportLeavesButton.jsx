"use client";
import { exportToCsv } from "@/helpers/hr/vacation";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFileExport } from "react-icons/fa";

export default function ExportLeavesButton() {
	const [requests, setRequests] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [positions, setPositions] = useState([]);
	const [approvalStatuses, setApprovalStatuses] = useState([]);
	const [vacationTypes, setVacationTypes] = useState([]);
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
		const paramsApprovalStatus =
			urlSearchParams.get("approvalStatus")?.split(",") || [];
		const paramsVacationTypes =
			urlSearchParams.get("vacationTypes")?.split(",") || [];
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
		if (!_.isEqual(vacationTypes, paramsVacationTypes)) {
			setVacationTypes(urlSearchParams?.get("vacationTypes")?.split(",") || []);
		}

		if (!_.isEqual(positions, paramsPositions)) {
			setPositions(urlSearchParams?.get("position")?.split(",") || []);
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

	async function loadProjectRequests() {
		await fetch(
			`/api/hr/vacation/load/all/export?department=${departments.join(
				","
			)}&position=${positions.join(
				","
			)}&from=${from}&to=${to}&employeeId=${employeeId}&approvalStatus=${approvalStatuses.join(
				","
			)}&vacationTypes=${vacationTypes.join(",")}`,
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

	const exportLeaves = async () => {
		toast.promise(loadProjectRequests(), {
			loading: "Exporting Leaves...",
			success: "Leaves exported successfully!",
			error: "Something went wrong!",
		});
	};

	return (
		<button
			onClick={exportLeaves}
			className={`  bg-green-500 hover:bg-green-700
    self-end  text-white font-semibold py-2 px-4 flex flex-row gap-2 text-lg items-center justify-center rounded-lg `}
		>
			Export <FaFileExport className="rotate-90" size={20} />
		</button>
	);
}
