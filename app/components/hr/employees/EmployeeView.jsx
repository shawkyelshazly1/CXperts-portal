import DetailsCard from "@/components/profile/DetailsCard";
import EmployeeCard from "@/components/profile/Employee Card";
import Image from "next/image";
import React from "react";
import S from "underscore.string";
import SubordinateCard from "./SubordinateCard";
import DateDetailsCard from "./DateDetailsCard";

export default function EmployeeView({ employee }) {
	return (
		<div className="w-full h-full container grid grid-cols-1  xl:grid-cols-4 gap-8 md:gap-20  py-6 px-6">
			<div className="flex flex-col">
				{" "}
				<Image
					src={"/profile_image.png"}
					className="rounded-full border-[4px] border-[#fbb919]"
					width={250}
					height={250}
					alt="profile_image"
				/>
				<div className="lg:flex lg:flex-col grid grid-cols-2 gap-4 mt-8">
					<h1 className="font-medium text-xl text-slate-400">
						Employee Details
					</h1>
					<DetailsCard title={"First Name"} value={employee.firstName} />
					<DetailsCard title={"Last Name"} value={employee.lastName} />
					<DetailsCard title={"Email Address"} value={employee.email} />
					<DetailsCard title={"Employee ID"} value={employee.employeeId} />
					{employee.manager ? (
						<DetailsCard
							title={"Manager"}
							value={
								S(employee.manager.firstName).capitalize().value() +
								" " +
								S(employee.manager.lastName).capitalize().value()
							}
						/>
					) : (
						<></>
					)}

					<DetailsCard
						title={"Position"}
						value={employee.position.title
							.split("_")
							.map((word) => S(word).capitalize().value())
							.join(" ")}
					/>
				</div>
			</div>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-4">
					<h1 className="font-medium text-xl text-slate-400">Department</h1>
					<DetailsCard
						title={"Department"}
						value={employee.department.name
							.split("_")
							.map((word) => S(word).capitalize().value())
							.join(" ")}
					/>
					{employee.project && (
						<DetailsCard
							title={"Project"}
							value={employee.project?.name
								.split("_")
								.map((word) => S(word).capitalize().value())
								.join(" ")}
						/>
					)}
				</div>
				<div className="flex flex-col gap-4">
					<h1 className="font-medium text-xl text-slate-400">
						Employee Information
					</h1>
					<DateDetailsCard
						title={"Date Of Birth"}
						value={employee.dateOfBirth}
					/>
					<DateDetailsCard title={"Hiring Date"} value={employee.hiringDate} />
					<DetailsCard
						title={"Phone Number"}
						value={employee.phoneNumber
							?.split("_")
							.map((word) => S(word).capitalize().value())
							.join(" ")}
					/>
					<DetailsCard
						title={"Nationality"}
						value={employee.nationality
							?.split("_")
							.map((word) => S(word).capitalize().value())
							.join(" ")}
					/>
					<DetailsCard
						title={"National ID"}
						value={employee.nationalId
							?.split("_")
							.map((word) => S(word).capitalize().value())
							.join(" ")}
					/>
				</div>
			</div>
			<div className="flex flex-col col-span-1 xl:col-span-2 gap-4">
				<h1 className="font-medium text-xl text-slate-400 ">Team</h1>
				<div className="grid grid-cols-2 gap-4 ">
					{employee.subordinates.length > 0 ? (
						<>
							{employee.subordinates?.map((subordinate) => (
								<SubordinateCard
									employee={subordinate}
									key={subordinate.employeeId}
								/>
							))}
						</>
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
}
