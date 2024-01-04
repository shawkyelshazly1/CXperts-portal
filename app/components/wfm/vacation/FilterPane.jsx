"use client";
import React from "react";
import ProjectsFilter from "./filters/ProjectsFilter";

export default function FilterPane({ filters }) {
	return (
		<div className="flex flex-row gap-3 items-center">
			{/* <LocalizationProvider dateAdapter={AdapterMoment}>
				<div className="flex flex-row gap-2">
					<div className="flex flex-col items-start">
						<h1 className="text-lg font-semibold">Form</h1>
						<DatePickerFrom />
					</div>
					<div className="flex flex-col items-start">
						<h1 className="text-lg font-semibold">To</h1>
						<DatePickerTo />
					</div>
				</div>
			</LocalizationProvider> */}
			<div className="flex flex-row gap-2">
				<div className="flex flex-col items-start">
					<h1 className="text-lg font-semibold">Project</h1>
					<ProjectsFilter projects={filters?.projects} />
				</div>
			</div>
		</div>
	);
}
