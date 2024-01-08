import DetailsCard from "@/components/profile/DetailsCard";
import Image from "next/image";
import React from "react";
import S from "underscore.string";

export default function EmployeeViewAndEditForm({ employee }) {
	return (
		<div className="w-full h-full container grid grid-cols-2  xl:grid-cols-4 gap-8 md:gap-20  py-6 px-6">
			<div className="flex flex-col">
				{" "}
				<Image
					src={"/profile_image.png"}
					className="rounded-full border-[4px] border-[#fbb919]"
					width={250}
					height={250}
					alt="profile_image"
				/>
				<div className="lg:flex lg:flex-col grid grid-cols-2 gap-4 mt-12">
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
			</div>
		</div>
	);
}
