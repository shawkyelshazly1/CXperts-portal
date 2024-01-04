"use client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import React from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import DepartmentFilter from "./filters/DepartmentFilter";
import PositionFilter from "./filters/PositionFilter";
import DatePickerFrom from "./filters/DatePickerFrom";
import DatePickerTo from "./filters/DatePickerTo";

export default function FilterPane({ filters }) {
	return (
		<div className="flex flex-row gap-3 items-center">
			<LocalizationProvider dateAdapter={AdapterMoment}>
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
			</LocalizationProvider>
			<div className="flex flex-row gap-2">
				<div className="flex flex-col items-start">
					<h1 className="text-lg font-semibold">Department</h1>
					<DepartmentFilter departments={filters.departments} />
				</div>
				<div className="flex flex-col items-start">
					<h1 className="text-lg font-semibold">Position</h1>
					<PositionFilter positions={filters.positions} />
				</div>
			</div>
		</div>
	);
}
