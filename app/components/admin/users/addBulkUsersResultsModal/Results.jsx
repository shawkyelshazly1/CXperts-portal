import { useData } from "app/contexts/admin/UserPageContext";
import React from "react";
import ErrorsAccordion from "./ErrorsAccordion";

export default function Results() {
	// load results from provider
	const { data } = useData();

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<div className="flex flex-row justify-between gap-6">
					<h1 className="font-semibold">Total: {data?.total || 0}</h1>|
					<h1 className="font-semibold text-green-600">
						Success: {data?.successful || 0}
					</h1>
					|
					<h1 className="font-semibold text-red-600">
						Failed: {data?.failed || 0}
					</h1>
				</div>
				<hr />
			</div>
			<ErrorsAccordion errors={data?.errors || []} />
		</div>
	);
}
