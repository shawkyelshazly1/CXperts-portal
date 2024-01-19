import moment from "moment";
import React from "react";
import S from "underscore.string";

export default function ResignationFullView({ resignation }) {
	return (
		<div className="w-full h-full flex flex-row justify-evenly">
			<div className="flex flex-col w-full">
				{/* employee details */}
				<div className="flex flex-col bg-white rounded-lg p-6 w-full ">
					<h1 className="text-2xl font-bold  text-primary mb-4">
						Employee Details
					</h1>

					<div className="grid grid-cols-2 w-fit gap-y-2">
						<p className="text-gray-500">
							<strong>Employee ID:</strong>
						</p>
						<p>{S(resignation.employee.employeeId).capitalize().value()}</p>
						<p className="text-gray-500">
							<strong>Full Name:</strong>
						</p>
						<p>{`${S(resignation.employee.firstName).capitalize().value()} ${S(
							resignation.employee.lastName
						)
							.capitalize()
							.value()}`}</p>
						<p className="text-gray-500">
							<strong>Email Address:</strong>
						</p>
						<p>{resignation.employee.email}</p>
						<p className="text-gray-500">
							<strong>Department:</strong>
						</p>
						<p>
							{resignation.employee.department.name
								?.split("_")
								.map((word) => S(word).capitalize().value())
								.join(" ")}
						</p>
						<p className="text-gray-500">
							<strong>Position:</strong>
						</p>
						<p>
							{resignation.employee.position.title
								?.split("_")
								.map((word) => S(word).capitalize().value())
								.join(" ")}
						</p>
						<p className="text-gray-500">
							<strong>Manager:</strong>
						</p>
						<p>
							{resignation.employee.manager
								? `${S(resignation.employee.manager.firstName)
										.capitalize()
										.value()} ${S(resignation.employee.manager.lastName)
										.capitalize()
										.value()}`
								: ""}
						</p>
						<p className="text-gray-500">
							<strong>Hiring Date:</strong>
						</p>
						<p>
							{moment(resignation.employee.hiringDate).format("DD-MMM-YYYY")}
						</p>
						<p className="text-gray-500">
							<strong>Account Status:</strong>
						</p>
						<p>{S(resignation.employee.accountStatus).capitalize().value()}</p>
						<p className="text-gray-500">
							<strong>Phone Number:</strong>
						</p>
						<p>{resignation.employee.phoneNumber}</p>
						<p className="text-gray-500">
							<strong>Project:</strong>
						</p>
						<p>{resignation.employee.project}</p>
					</div>
				</div>
			</div>
			<div className="flex flex-col w-full">a</div>
		</div>
	);
}
