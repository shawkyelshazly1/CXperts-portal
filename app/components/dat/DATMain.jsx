"use client";

import EmployeeInfo from "./EmployeeInfo";
import ActionsForm from "./ActionsForm";
import EmployeeActionHistory from "./EmployeeActionHistory";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DATMain() {
	const params = useSearchParams();
	const [employee, setEmployee] = useState(undefined);

	useEffect(() => {
		async function fetchEmployeeInfo() {
			if (!params.get("employeeId")) return;

			try {
				const response = await fetch(
					`/api/dat/employee/${params.get("employeeId")}`
				);
				if (!response.ok) {
					let errorMessage = await response.json();
					setEmployee(errorMessage);
				}

				const data = await response.json();
				// Assuming there's a state setter named setEmployee
				setEmployee(data.employee);
			} catch (error) {
				toast.error("Something went wrong!");
				console.error(error);
				// Handle error state, e.g., setEmployee({ error: error.message })
			}
		}

		fetchEmployeeInfo();
	}, [params]);
	{
		return employee === undefined || employee?.error ? (
			<div className="flex w-full items-center justify-center">
				{employee?.error ? (
					<h1 className="text-red-500 font-medium text-xl">
						{employee?.error}
					</h1>
				) : (
					<h1 className="text-primary font-medium text-xl">
						Search For Employee
					</h1>
				)}
			</div>
		) : (
			<div className="flex w-full flex-col items-center justify-center">
				<EmployeeInfo employee={employee} />

				<ActionsForm employee={employee} />
				<hr className="w-full my-4" />
				<EmployeeActionHistory employeeId={employee?.employeeId} />
			</div>
		);
	}

	return <span>test</span>;
}
