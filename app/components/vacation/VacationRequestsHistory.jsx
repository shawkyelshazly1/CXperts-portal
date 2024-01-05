"use client";
import React from "react";
import VacationRequestsTable from "./VacationRequestsTable";
import ExportDataButton from "./ExportDataButton";
import { useSession } from "next-auth/react";

export default function VacationRequestsHistory() {
	const { data } = useSession();

	return (
		<div className="flex flex-col gap-6 w-full">
			<div className="flex flex-col-reverse md:flex-row justify-between">
				<h1 className="text-3xl font-medium italic text-gray-500">
					Requests History
				</h1>
				{data?.user?.position.title === "representative" ? (
					<></>
				) : (
					<div className="self-end ">
						<ExportDataButton />
					</div>
				)}
			</div>

			<VacationRequestsTable />
		</div>
	);
}
