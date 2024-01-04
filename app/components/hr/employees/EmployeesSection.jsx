import React from "react";
import EmployeeModal from "./EmployeeModal";

export default function EmployeesSection({ employees }) {
	return (
		<div className="grid grid-flow-row grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 w-full items-center gap-x-8 gap-y-4 flex-wrap">
			{employees?.map((employee) => (
				<EmployeeModal employee={employee} key={employee.id} />
			))}
		</div>
	);
}
