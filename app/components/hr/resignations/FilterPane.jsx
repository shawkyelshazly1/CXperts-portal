"use client";
import { useState } from "react";
import DepartmentFilter from "./filters/DepartmentFilter";
import PositionFilter from "./filters/PositionFilter";
import { Box, Drawer, Typography } from "@mui/material";
import { LiaFilterSolid } from "react-icons/lia";
import EmployeeIdFilter from "./filters/EmployeeIdFilter";
import StatusFilter from "./filters/StatusFilter";

export default function FilterPane({ filters }) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	return (
		<>
			<button
				onClick={() => setIsDrawerOpen(true)}
				className="self-end bg-blue-500 text-white font-semibold py-2 px-4 flex flex-row gap-1 text-lg items-center justify-center rounded-lg hover:bg-blue-700"
			>
				Show Filters <LiaFilterSolid size={25} />
			</button>
			<Drawer
				anchor="right"
				open={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
			>
				<Box p={2} width={350} textAlign={"center"} role="presentation">
					<Typography variant="h6" component="div" className="mb-2">
						Filter Resignations
					</Typography>
					<hr className="mb-2" />
					<div className="flex flex-col gap-3 items-center w-fit">
						<div className="flex flex-col gap-2">
							<div className="flex flex-col items-start">
								<h1 className="text-lg font-semibold">Employee ID</h1>
								<EmployeeIdFilter />
							</div>
							<div className="flex flex-col items-start">
								<h1 className="text-lg font-semibold">Department</h1>
								<DepartmentFilter departments={filters.departments} />
							</div>
							<div className="flex flex-col items-start">
								<h1 className="text-lg font-semibold">Position</h1>
								<PositionFilter positions={filters.positions} />
							</div>

							<div className="flex flex-col items-start">
								<h1 className="text-lg font-semibold">Resignation Status</h1>
								<StatusFilter />
							</div>
						</div>
					</div>
				</Box>
			</Drawer>
		</>
	);
}
